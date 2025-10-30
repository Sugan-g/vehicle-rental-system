import express from "express";
import { createBooking, getUserBookings, getAllBookings } from "../controllers/bookingController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/", protect, createBooking);
router.get("/my", protect, getUserBookings);

// Admin route
router.get("/", protect, admin, getAllBookings);

export default router;
