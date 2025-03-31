import {Router} from 'express';
import { getImageByTitle, getImageById } from "../controllers/image.controller.js";

const router = Router();

router.route("/getImageByTitle").get(getImageByTitle);
router.route("/getImageById/:id").get(getImageById);

export default router;