import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";
import sendEmail from "../utils/sendEmail.js";

// Create new booking
export const createBooking = async (req, res) => {
    try {
        const { vehicle, startDate, endDate, amount } = req.body;

        // Check vehicle availability (optional)
        const vehicleDetails = await Vehicle.findById(vehicle);
        if (!vehicleDetails) return res.status(404).json({ message: "Vehicle not found" });

        const booking = await Booking.create({
            user: req.user._id,
            vehicle,
            startDate,
            endDate,
            amount,
            paymentStatus: "Pending"
        });

        // Send booking confirmation email
        const userDetails = await User.findById(req.user._id);
        const message = `
Hi ${userDetails.name},

Your booking for ${vehicleDetails.make} ${vehicleDetails.model} is confirmed.

Start Date: ${new Date(startDate).toDateString()}
End Date: ${new Date(endDate).toDateString()}
Amount: ₹${amount}

Thank you for using our service!
        `;

        sendEmail(userDetails.email, "Booking Confirmation", message);

        res.status(201).json(booking);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get bookings for logged-in user
export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate("vehicle");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Admin: get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate("user").populate("vehicle");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
