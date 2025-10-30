// controllers/bookingController.js
import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";
import sendEmail from "../utils/sendEmail.js";

// ✅ Create Booking
export const createBooking = async (req, res) => {
    try {
        const { vehicle, startDate, endDate, totalAmount } = req.body;
        const user = req.user.id;

        const booking = await Booking.create({
            vehicle,
            user,
            startDate,
            endDate,
            totalAmount,
            status: "booked",
        });

        // ✅ Email Notification: Booking Confirmed
        await sendEmail(
            req.user.email,
            "Booking Confirmed",
            `Your booking for vehicle ID ${vehicle} is confirmed from ${startDate} to ${endDate}.`
        );

        res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Booking failed" });
    }
};

// ✅ Get user bookings
export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate("vehicle")
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Failed fetching bookings" });
    }
};

// ✅ Update Booking
export const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        booking.startDate = req.body.startDate || booking.startDate;
        booking.endDate = req.body.endDate || booking.endDate;
        booking.totalAmount = req.body.totalAmount || booking.totalAmount;
        await booking.save();

        // ✅ Email Notification: Booking Updated
        await sendEmail(
            req.user.email,
            "Booking Updated",
            `Your booking has been updated.\nNew Date: ${booking.startDate} to ${booking.endDate}`
        );

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};

// ✅ Cancel Booking
export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        booking.status = "cancelled";
        await booking.save();

        // ✅ Email Notification: Booking Cancelled
        await sendEmail(
            req.user.email,
            "Booking Cancelled",
            `Your booking for Vehicle ID ${booking.vehicle} has been cancelled`
        );

        res.json({ message: "Booking cancelled successfully" });
    } catch (error) {
        res.status(500).json({ message: "Cancel failed" });
    }
};
