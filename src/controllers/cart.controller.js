import Cart from "../models/cart.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRsponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Add item to cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, price } = req.body; // Added price
  const userId = req.user?._id;

  console.log("req.user in addToCart:", req.user);
  console.log("userId in addToCart:", userId);

  if (!productId || !price) {
    throw new ApiError(400, "Product ID and price are required");
  }

  if (!userId) {
    throw new ApiError(401, "User ID not found in request");
  }

  // Check if the product is already in the user's cart
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
    return res
      .status(200)
      .json(new ApiResponse(200, cart, "Cart updated successfully"));
  }

  // Add a new product to the cart
  cart = await Cart.create({
    userId,
    items: [{ productId, quantity, price }],
    totalAmount: price * quantity,
  });

  if (!cart) {
    throw new ApiError(500, "Failed to add item to cart");
  }

  res
    .status(201)
    .json(new ApiResponse(201, cart, "Item added to cart successfully"));
});

export { addToCart };