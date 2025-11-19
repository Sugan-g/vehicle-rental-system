import express from "express";
import {
    createOrder,
    verifyPayment,
    demoVerifyPayment
} from "../controllers/paymentController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create Razorpay order (real)
router.post("/create-order", protect, createOrder);

// Verify real Razorpay payment
router.post("/verify", protect, verifyPayment);

// ✅ DEMO PAYMENT (NO RAZORPAY REQUIRED)
router.post("/demo-verify", protect, demoVerifyPayment);

export default router;
