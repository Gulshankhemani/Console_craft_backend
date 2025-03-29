import asyncHandler from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiRsponse.js";
import ApiError from "../utils/ApiError.js";
import Like from "../models/like.model.js"; 

// Add a like to a comment
const addLike = asyncHandler(async (req, res) => {
  const { commentId } = req.body; // Comment ID from request body
  const userId = req.user?._id; // Assuming user ID is available in req.user from authentication middleware

  if (!commentId) {
    throw new ApiError(400, "Comment ID is required");
  }

  // Check if the user has already liked the comment
  const existingLike = await Like.findOne({
    comment: commentId,
    Likeby: userId,
  });

  if (existingLike) {
    throw new ApiError(400, "You have already liked this comment");
  }

  // Create a new like
  const like = await Like.create({
    comment: commentId,
    Likeby: userId,
  });

  if (!like) {
    throw new ApiError(500, "Failed to add like");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, like, "Like added successfully"));
});

// Remove a like from a comment
const removeLike = asyncHandler(async (req, res) => {
  const { commentId } = req.body; // Comment ID from request body
  const userId = req.user?._id; // Assuming user ID from authenticated user

  if (!commentId) {
    throw new ApiError(400, "Comment ID is required");
  }

  // Find and delete the like
  const like = await Like.findOneAndDelete({
    comment: commentId,
    Likeby: userId,
  });

  if (!like) {
    throw new ApiError(404, "Like not found or already removed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Like removed successfully"));
});

// Get all likes for a specific comment
const getLikesByComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params; // Comment ID from URL params

  if (!commentId) {
    throw new ApiError(400, "Comment ID is required");
  }

  const likes = await Like.find({ comment: commentId }).populate(
    "Likeby",
    "username avatar" // Populate user details (e.g., username, avatar)
  );

  return res
    .status(200)
    .json(new ApiResponse(200, likes, "Likes retrieved successfully"));
});

// Check if a user has liked a comment
const hasUserLikedComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params; // Comment ID from URL params
  const userId = req.user?._id; // Assuming user ID from authenticated user

  if (!commentId) {
    throw new ApiError(400, "Comment ID is required");
  }

  const like = await Like.findOne({
    comment: commentId,
    Likeby: userId,
  });

  const hasLiked = !!like; // Boolean: true if like exists, false otherwise

  return res
    .status(200)
    .json(
      new ApiResponse(200, { hasLiked }, "Like status retrieved successfully")
    );
});

export { addLike, removeLike, getLikesByComment, hasUserLikedComment };