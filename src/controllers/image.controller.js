import Image from "../models/Image.models.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRsponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getImageByTitle = asyncHandler(async (req, res) => {
  const { title, page = 1, limit = 10 } = req.query;
  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const images = await Image.find({ title: { $regex: title, $options: "i" } })
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  if (!images || images.length === 0) {
    throw new ApiError(404, "No images found with this title");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Images fetched successfully", images));
});

const getImageById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Image ID is required");
  }

  const image = await Image.findById(id);

  if (!image) {
    throw new ApiError(404, "Image not found with this ID");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Image fetched successfully", image));
});

const getImageByCategory = asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  if (!category) {
    throw new ApiError(400, "Category is required");
  }

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const images = await Image.find({ category })
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  if (!images || images.length === 0) {
    throw new ApiError(404, "No images found in this category");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Images fetched successfully", images));
});

export { getImageByTitle, getImageById, getImageByCategory };