import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";
import sendEmail from "../utils/sendEmail.js"; // ✅ your nodemailer util

// ✅ Create Booking
export const createBooking = async (req, res) => {
    try {
        const { vehicleId, startDate, endDate } = req.body;
        const userId = req.user._id;

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

        const newBooking = await Booking.create({
            vehicle: vehicleId,
            vehicleOwner: vehicle.owner,
            user: userId,
            startDate,
            endDate,
            totalAmount: vehicle.pricePerDay
        });

        // ✅ Send Email
        await sendEmail(req.user.email, "Booking Confirmed ✅", `
            Your booking for ${vehicle.make} ${vehicle.model} is confirmed.
            Start: ${startDate}
            End: ${endDate}
        `);

        res.status(201).json(newBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Get Logged-in user's bookings
export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate("vehicle");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Cancel Booking
export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("vehicle");
        if (!booking) return res.status(404).json({ message: "Not found" });

        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not allowed" });
        }

        booking.status = "cancelled";
        await booking.save();

        // ✅ Cancel Email
        await sendEmail(req.user.email, "Booking Cancelled ❌", `
            Booking for ${booking.vehicle.make} ${booking.vehicle.model} has been cancelled.
        `);

        res.json({ message: "Booking cancelled" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Delete Booking (only if cancelled)
export const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Not found" });

        if (booking.status !== "cancelled") {
            return res.status(400).json({ message: "Cancel before deleting" });
        }

        await booking.deleteOne();
        res.json({ message: "Booking deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
