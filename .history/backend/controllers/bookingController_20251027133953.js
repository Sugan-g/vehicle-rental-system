import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";
import sendEmail from "../utils/sendEmail.js";

// Email UI Template
const emailTemplate = (title, message, booking, vehicle) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color:#2563eb;">${title}</h2>
    <p>${message}</p>

    <h4>Booking Details:</h4>
    <p><strong>Vehicle:</strong> ${vehicle.make} ${vehicle.model}</p>
    <p><strong>From:</strong> ${new Date(booking.startDate).toDateString()}</p>
    <p><strong>To:</strong> ${new Date(booking.endDate).toDateString()}</p>
    <p><strong>Price Per Day:</strong> ₹${vehicle.pricePerDay}</p>

    <p style="margin-top:20px;">Thanks for choosing Vehicle Rental 🚗</p>
  </div>
`;

// Create New Booking
export const createBooking = async (req, res) => {
    try {
        const { vehicleId, startDate, endDate } = req.body;

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

        const booking = await Booking.create({
            user: req.user._id,
            vehicle: vehicleId,
            startDate,
            endDate,
            status: "booked",
        });

        await sendEmail(
            req.user.email,
            "Booking Confirmed ✅",
            emailTemplate("Booking Confirmed ✅", "Your booking was successful!", booking, vehicle)
        );

        res.json({ message: "Booked Successfully ✅ Email Sent!", booking });
    } catch (error) {
        res.status(500).json({ message: "Booking failed", error });
    }
};

// Get My Bookings
export const getMyBookings = async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate("vehicle");
    res.json(bookings);
};

//  Single Booking for Edit Page
export const getBookingById = async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    res.json(booking);
};

// Update Booking + Email
export const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("vehicle");

        booking.startDate = req.body.startDate;
        booking.endDate = req.body.endDate;
        await booking.save();

        await sendEmail(
            req.user.email,
            "Booking Updated ",
            emailTemplate("Booking Updated ", "Your booking dates have been updated!", booking, booking.vehicle)
        );

        res.json({ message: "Booking Updated  Email Sent!" });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};

//  Cancel Booking + Email
export const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("vehicle");
        booking.status = "cancelled";
        await booking.save();

        await sendEmail(
            req.user.email,
            "Booking Cancelled ",
            emailTemplate("Booking Cancelled ", "Your booking has been cancelled!", booking, booking.vehicle)
        );

        res.json({ message: "Booking Cancelled Email Sent!" });
    } catch (error) {
        res.status(500).json({ message: "Cancel failed" });
    }
};
