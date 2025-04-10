import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addToCart, removeFromCart,getCart } from "../controllers/cart.controller.js";

const router = express.Router();

// Protected routes (require authentication)
router.post("/", verifyJwt, addToCart); // Add item to cart
router.route("/:productId").delete(verifyJwt, removeFromCart);
router.get("/", verifyJwt, getCart);

export default router;
