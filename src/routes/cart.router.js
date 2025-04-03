import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addToCart } from "../controllers/cart.controller.js";

const router = express.Router();

// Protected routes (require authentication)
router.post("/add", verifyJwt, addToCart); // Add item to cart

export default router;