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

//  User → Get my bookings (put this BEFORE the admin route)
router.get("/my", protect, getMyBookings);

//  Common → Get single booking by ID
router.get("/:id", protect, getBookingById);

//  Common → Update booking
router.put("/:id", protect, updateBooking);

//  Common → Cancel booking
router.put("/:id/cancel", protect, deleteBooking);

// 🔹 User → Create booking
router.post("/", protect, createBooking);

// 🔹 Admin → Get all bookings
router.get("/", protect, admin, getAllBookings);

export default router;
