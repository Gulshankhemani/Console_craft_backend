import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  addLike,
  removeLike,
  getLikesByComment,
  hasUserLikedComment,
} from "../controllers/like.controller.js";

const router = express.Router();

router.post("/like", verifyJwt, addLike);                   
router.delete("/like", verifyJwt, removeLike);               
router.get("/likes/comment/:commentId", getLikesByComment); 
router.get("/like/status/:commentId", verifyJwt, hasUserLikedComment); 

export default router;