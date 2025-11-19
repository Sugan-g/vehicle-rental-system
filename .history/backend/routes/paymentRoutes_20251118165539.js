import express from "express";
import {
    createCheckoutSession,
    verifyPayment,
    paymentCancel
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.get("/verify", verifyPayment);
router.get("/cancel", paymentCancel);

export default router;
