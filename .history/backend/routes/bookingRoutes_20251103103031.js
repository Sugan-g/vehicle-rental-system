import express from "express";
import {
    createBooking,
    getMyBookings,
    updateBooking,
    deleteBooking,
    getBookingById,
    getAllBookings
} from "../controllers/bookingController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all bookings (Admin only)
router.get("/", protect, admin, getAllBookings);

// Create a new booking (User)
router.post("/", protect, createBooking);

// Get current user's bookings
router.get("/my", protect, getMyBookings);

// Get booking by ID
router.get("/:id", protect, getBookingById);

// Update booking
router.put("/:id", protect, updateBooking);

// Cancel booking
router.put("/:id/cancel", protect, deleteBooking);

export default router;
