import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";
import { protect } from "../middlewares/authMiddleware.js"; // to restrict unauthorized users

const router = express.Router();

// Create Razorpay order
router.post("/create-order", protect, createOrder);

// Verify payment
router.post("/verify", protect, verifyPayment);

export default router;
