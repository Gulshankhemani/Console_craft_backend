import { Router } from 'express';
import { getAllVideos } from "../controllers/video.controller.js";
// import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

// Public route - No authentication required
router.route("/").get(getAllVideos);

// Add other routes that require authentication below
// Example: router.use(verifyJwt); // Apply to routes below this line
// router.route("/").post(verifyJwt, uploadVideo); // Example for protected routes

export default router;