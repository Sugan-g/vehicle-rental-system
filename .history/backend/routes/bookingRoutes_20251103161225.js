import express from "express";
import {
    createBooking,
    getMyBookings,
    updateBooking,
    deleteBooking,
    getBookingById,
    getAllBookings,
} from "../controllers/bookingController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔹 Admin → Get all bookings
router.get("/", protect, admin, getAllBookings);

// 🔹 User → Create booking
router.post("/", protect, createBooking);

// 🔹 User → Get my bookings
router.get("/my", protect, getMyBookings);

// 🔹 Common → Get single booking by ID
router.get("/:id", protect, getBookingById);

// 🔹 Common → Update booking
router.put("/:id", protect, updateBooking);

// 🔹 Common → Cancel booking
router.put("/:id/cancel", protect, deleteBooking);

export default router;
