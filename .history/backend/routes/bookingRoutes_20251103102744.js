import express from "express";
import Booking from "../models/Booking.js";
import {
    createBooking,
    getMyBookings,
    updateBooking,
    deleteBooking,
    getBookingById,
} from "../controllers/bookingController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ===========================
   🔹 USER ROUTES
=========================== */

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

/* ===========================
   🔹 ADMIN ROUTE
=========================== */

// Get all bookings (Admin only)
router.get("/admin/all", protect, admin, async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "name email")
            .populate("vehicle", "make model pricePerDay");

        if (!bookings || bookings.length === 0) {
            return res.status(200).json([]);
        }

        const bookingsWithAmount = bookings.map((b) => {
            const start = new Date(b.startDate);
            const end = new Date(b.endDate);
            const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
            const amount = b.vehicle?.pricePerDay ? b.vehicle.pricePerDay * diffDays : 0;

            return {
                ...b._doc,
                amount,
                paymentStatus: b.status?.toLowerCase() === "booked" ? "Paid" : "Cancelled",
            };
        });

        res.status(200).json(bookingsWithAmount);
    } catch (error) {
        console.error("Error fetching admin bookings:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

export default router;
