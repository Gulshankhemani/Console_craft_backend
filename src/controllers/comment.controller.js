import Comment from "../models/comment.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRsponse.js";

// Create a new comment or reply
const createComment = asyncHandler(async (req, res) => {
  const { content, parentCommentId } = req.body;
  const userId = req.user?._id;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Comment content is required");
  }

  const commentData = {
    content: content.trim(),
    owner: userId,
    parentComment: parentCommentId || null,
  };

  const comment = await Comment.create(commentData);

  if (parentCommentId) {
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      throw new ApiError(404, "Parent comment not found");
    }
    await Comment.findByIdAndUpdate(parentCommentId, {
      $push: { replies: comment._id },
    });
  }

  const populatedComment = await Comment.findById(comment._id).populate(
    "owner",
    "username avatar"
  );

  return res
    .status(201)
    .json(
      new ApiResponse(201, populatedComment, "Comment created successfully")
    );
});

// Update an existing comment
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user?._id;

  if (!commentId) {
    throw new ApiError(400, "Comment ID is required");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Updated content is required");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this comment");
  }

  comment.content = content.trim();
  await comment.save();

  const updatedComment = await Comment.findById(comment._id).populate(
    "owner",
    "username avatar"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

// Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user?._id;

  if (!commentId) {
    throw new ApiError(400, "Comment ID is required");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  if (comment.parentComment) {
    await Comment.findByIdAndUpdate(comment.parentComment, {
      $pull: { replies: commentId },
    });
  }

  const deleteReplies = async (commentId) => {
    const comment = await Comment.findById(commentId).populate("replies");
    if (comment.replies.length > 0) {
      for (const reply of comment.replies) {
        await deleteReplies(reply._id);
      }
    }
    await Comment.findByIdAndDelete(commentId);
  };

  await deleteReplies(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});

// Get paginated comments with nested replies
const getComments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    customLabels: {
      docs: "comments",
    },
  };

  const aggregationPipeline = [
    // Match top-level comments
    {
      $match: {
        $or: [
          { parentComment: null },
          { parentComment: { $exists: false } },
          { parentComment: "" },
        ],
      },
    },
    // Look up owner info for parent comments
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: "$owner",
    },
    // Look up reply comments with their complete details
    {
      $lookup: {
        from: "comments",
        let: { replyIds: "$replies" },
        pipeline: [
          { $match: { $expr: { $in: ["$_id", "$$replyIds"] } } },
          // Look up owner info for each reply
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
            },
          },
          { $unwind: "$owner" },
          // Project only required fields for each reply
          {
            $project: {
              content: 1,
              createdAt: 1,
              updatedAt: 1,
              "owner._id": 1,
              "owner.Username": 1,
              "owner.avatar": 1,
            },
          },
        ],
        as: "replies",
      },
    },
    // Final projection
    {
      $project: {
        content: 1,
        createdAt: 1,
        updatedAt: 1,
        "owner._id": 1,
        "owner.Username": 1,
        "owner.avatar": 1,
        replies: 1,
      },
    },
  ];

  const result = await Comment.aggregatePaginate(
    Comment.aggregate(aggregationPipeline),
    options
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Comments fetched successfully"));
});


export { createComment, updateComment, deleteComment, getComments };