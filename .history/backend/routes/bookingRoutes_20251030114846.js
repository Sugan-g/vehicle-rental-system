import express from "express";
import {
    createBooking,
    getMyBookings,
    updateBooking,
    deleteBooking,
    getBookingById
} from "../controllers/bookingController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id", protect, updateBooking);
router.put("/:id/cancel", protect, deleteBooking);
// Get all bookings (Admin only)
router.get("/", protect, async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "name email")
            .populate("vehicle", "make model pricePerDay");
        
        // calculate amount and status dynamically
        const bookingsWithAmount = bookings.map(b => {
            const start = new Date(b.startDate);
            const end = new Date(b.endDate);
            const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
            const amount = b.vehicle?.pricePerDay ? b.vehicle.pricePerDay * diffDays : 0;
            return {
                ...b._doc,
                amount,
                paymentStatus: b.status === "booked" ? "Paid" : "Cancelled"
            };
        });

        res.json(bookingsWithAmount);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

export default router;
