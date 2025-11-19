import express from "express";
import {
    createCheckoutSession,
    verifyPayment,
    paymentCancel
} from "../controllers/paymentController.js";

const router = express.Router();

// Create Stripe checkout session
router.post("/create-checkout-session", createCheckoutSession);

// Stripe redirects here → verify payment
router.get("/verify", verifyPayment);

// Payment cancelled
router.get("/cancel", paymentCancel);

export default router;
