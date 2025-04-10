import { Router } from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";
import  {verifyJwt}  from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create-order", verifyJwt, createOrder);
router.post("/verify-payment", verifyJwt, verifyPayment);

export default router;