import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createComment,
  updateComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controller.js";

const router = express.Router();

// Protected routes (require authentication)
router.post("/comment", verifyJwt, createComment); // Create a comment
router.put("/comment/:commentId", verifyJwt, updateComment); // PUT /api/v1/comments/comment/:commentId
router.delete("/comment/:commentId", verifyJwt, deleteComment); // DELETE /api/v1/comments/comment/:commentId


// Public or protected route (depending on your needs)
router.get("/", getComments); // Get paginated comments

export default router;