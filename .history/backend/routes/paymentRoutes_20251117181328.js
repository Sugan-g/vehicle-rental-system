import express from "express";
import { createPaymentIntent } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);

export default router;
