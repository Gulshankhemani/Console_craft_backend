// Create a new file: controllers/paymentController.js
import Razorpay from "razorpay";
import crypto from "crypto";
import  asyncHandler  from "../utils/asyncHandler.js";
import  ApiError  from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRsponse.js";

// Initialize Razorpay with your key ID and secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ||"rzp_test_RhtYF7tlln3tsk",
  key_secret: process.env.RAZORPAY_SECRET || "aBLjDrHLlCqbRRB5kjtdWbno"
});

// Create a new order
const createOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  
  const options = {
    amount: amount * 100, // amount in smallest currency unit (paise)
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
    payment_capture: 1
  };

  try {
    const order = await razorpay.orders.create(options);
    return res.status(200).json(
      new ApiResponse(200, order, "Order created successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Error creating Razorpay order");
  }
});

// Verify p`a`yment signature
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET || "aBLjDrHLlCqbRRB5kjtdWbno")
    .update(body.toString())
    .digest("hex");
    
  const isAuthentic = expectedSignature === razorpay_signature;
  
  if (isAuthentic) {
    return res.status(200).json(
      new ApiResponse(200, { payment_id: razorpay_payment_id }, "Payment successful")
    );
  } else {
    throw new ApiError(400, "Payment verification failed");
  }
});

export { createOrder, verifyPayment };