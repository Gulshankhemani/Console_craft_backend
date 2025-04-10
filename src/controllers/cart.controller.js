import Cart from "../models/cart.model.js";
import Image from "../models/Image.models.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRsponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

// Add item to cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, price } = req.body;
  const userId = req.user?._id;

  if (!productId || !mongoose.isValidObjectId(productId)) {
    throw new ApiError(400, "Valid image ID is required");
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new ApiError(400, "Quantity must be a positive integer");
  }
  if (!price || price < 0) {
    throw new ApiError(400, "Valid price is required");
  }

  const image = await Image.findById(productId);
  if (!image) {
    throw new ApiError(404, "Image not found");
  }
  if (image.price !== price) {
    throw new ApiError(400, "Invalid price provided for the image");
  }

  let cart = await Cart.findOne({ userId });

  if (cart) {
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price });
    }
    await cart.save();
  } else {
    cart = await Cart.create({
      userId,
      items: [{ productId, quantity, price }],
    });
  }

  const populatedCart = await Cart.findById(cart._id).populate(
    "items.productId",
    "title price imageUrl"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, populatedCart, "Item added to cart successfully"));
});

// Remove item from cart
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  console.log("removeFromCart called, req.user:", req.user); // Debug
  const userId = req.user?._id;

  if (!userId) {
    console.log("No userId, throwing 401"); // Debug
    throw new ApiError(401, "User not authenticated"); // Line 66
  }

  console.log("Removing item for userId:", userId.toString());
  console.log("ProductId to remove:", productId);

  if (!mongoose.isValidObjectId(productId)) {
    throw new ApiError(400, "Valid image ID is required");
  }

  const cart = await Cart.findOne({ userId });
  console.log("Found cart:", cart);

  if (!cart) {
    return res
      .status(200)
      .json(new ApiResponse(200, { items: [], totalAmount: 0 }, "Cart is empty, nothing to remove"));
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId && item.productId.toString() === productId
  );
  if (itemIndex === -1) {
    throw new ApiError(404, "Item not found in cart");
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate(
    "items.productId",
    "title price imageUrl"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, populatedCart, "Item removed from cart successfully"));
});

// Get user's cart
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const cart = await Cart.findOne({ userId }).populate(
    "items.productId",
    "title price imageUrl"
  );

  if (!cart) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, { items: [], totalAmount: 0 }, "Cart is empty")
      );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart retrieved successfully"));
});

export { addToCart, removeFromCart, getCart };