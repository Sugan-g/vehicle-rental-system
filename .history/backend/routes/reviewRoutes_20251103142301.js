import express from "express";
import {
    createReview,
    getReviewsByVehicle,
    getMyReviews,
} from "../controllers/reviewController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/reviews
 * @desc    Create or update a review for a vehicle
 * @access  Private
 */
router.post("/", protect, createReview);

/**
 * @route   GET /api/reviews/my
 * @desc    Get all reviews written by the logged-in user
 * @access  Private
 */
// router.get("/my", protect, getMyReviews);
router.get("/my", protect, getMyReviews);

/**
 * @route   GET /api/reviews/:vehicleId
 * @desc    Get all reviews for a specific vehicle
 * @access  Public
 */
router.get("/:vehicleId", getReviewsByVehicle);

export default router;
