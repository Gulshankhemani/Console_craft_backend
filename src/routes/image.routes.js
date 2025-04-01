import { Router } from "express";
import { getImageByTitle, getImageById, getImageByCategory } from "../controllers/image.controller.js";

const router = Router();

router.route("/getImageByTitle").get(getImageByTitle);
router.route("/getImageById/:id").get(getImageById);
router.route("/getImageByCategory").get(getImageByCategory);

export default router;