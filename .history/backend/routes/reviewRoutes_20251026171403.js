import express from "express";
import { createReview, getReviewsByVehicle } from "../controllers/reviewController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create review
router.post("/", protect, createReview);

// Get reviews for a vehicle
router.get("/:vehicleId", getReviewsByVehicle);

export default router;
