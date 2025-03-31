import Image from "../models/Image.models.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRsponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getImageByTitle = asyncHandler(async (req, res) => {
  const { title, page = 1, limit = 10 } = req.query; // Get title, page, and limit from query params
  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Fetch images matching the title (case-insensitive partial match)
  const images = await Image.find({ title: { $regex: title, $options: "i" } })
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .skip((pageNumber - 1) * limitNumber) // Skip for pagination
    .limit(limitNumber); // Limit the number of results

  if (!images || images.length === 0) {
    throw new ApiError(404, "No images found with this title");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Images fetched successfully", images));
});

// New function to get image by ID
const getImageById = asyncHandler(async (req, res) => {
  const { id } = req.params; // Get the ID from URL parameters

  if (!id) {
    throw new ApiError(400, "Image ID is required");
  }

  // Fetch the image by its MongoDB _id
  const image = await Image.findById(id);

  if (!image) {
    throw new ApiError(404, "Image not found with this ID");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Image fetched successfully", image));
});

export { getImageByTitle, getImageById }; 