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
// Admin → Get all bookings
router.get("/", protect, admin, getAllBookings);
//  Common → Get single booking by ID
router.get("/:id", protect, getBookingById);

//  Common → Update booking
router.put("/:id", protect, updateBooking);

//  Common → Cancel booking
router.put("/:id/cancel", protect, deleteBooking);

// User → Create booking
router.post("/", protect, createBooking);

router.get("/admin/stats", async (req, res) => {
    try {
        const booked = await Booking.countDocuments({ status: "booked" });
        const cancelled = await Booking.countDocuments({ status: "cancelled" });

        res.json({ booked, cancelled });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load stats" });
    }
});


export default router;
