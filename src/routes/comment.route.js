import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createComment,
  updateComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controller.js";

const router = express.Router();


router.post("/comment", verifyJwt, createComment); 
router.put("/comment/:commentId", verifyJwt, updateComment); 
router.delete("/comment/:commentId", verifyJwt, deleteComment); 



router.get("/", getComments); 

export default router;