import express from "express";
import {
    createReview,
    getReviewsByVehicle,
    getMyReviews
} from "../controllers/reviewController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create review
router.post("/", protect, createReview);

// Get all reviews by logged-in user
router.get("/my", protect, getMyReviews);

// Get reviews for a specific vehicle
router.get("/:vehicleId", getReviewsByVehicle);

export default router;
