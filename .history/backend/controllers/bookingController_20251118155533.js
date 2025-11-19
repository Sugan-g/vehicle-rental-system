import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";
import sendEmail from "../utils/sendEmail.js";

// Email template
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

// ============================
//  Create Booking
// ============================
export const createBooking = async (req, res) => {
    try {
        const { vehicleId, startDate, endDate } = req.body;

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle)
            return res.status(404).json({ message: "Vehicle not found" });

        const existing = await Booking.findOne({
            user: req.user._id,
            vehicle: vehicleId,
            startDate,
            endDate,
            status: "booked",
        });

        if (existing) {
            return res.status(400).json({ message: "Booking already exists for these dates" });
        }

        // ADD THIS 
        const dayDiff = Math.ceil(
            (new Date(endDate) - new Date(startDate)) /
            (1000 * 60 * 60 * 24)
        );

        const totalAmount = dayDiff * vehicle.pricePerDay;
        // ⭐ END ADD 

        const booking = await Booking.create({
            user: req.user._id,
            vehicle: vehicleId,
            startDate,
            endDate,
            status: "booked",
            totalAmount,     // ⭐ important
        });

        await sendEmail(
            req.user.email,
            "Booking Confirmed",
            emailTemplate("Booking Confirmed", "Your booking was successful!", booking, vehicle)
        );

        res.json({ message: "Booked Successfully! Email Sent!", booking });
    } catch (error) {
        res.status(500).json({ message: "Booking failed", error: error.message });
    }
};


// ============================
//  Get My Bookings (User) — Paginated
// ============================
export const getMyBookings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Booking.countDocuments({ user: req.user._id });

        const bookings = await Booking.find({ user: req.user._id })
            .populate("vehicle", "make model pricePerDay image location")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.json({
            data: bookings,
            total,
            page,
            limit,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch user bookings",
            error: error.message
        });
    }
};

// ============================
//  Get Booking by ID
// ============================
export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("vehicle");
        if (!booking)
            return res.status(404).json({ message: "Booking not found" });

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: "Failed to get booking", error: error.message });
    }
};

// ============================
//  Update Booking
// ============================
export const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("vehicle");
        if (!booking)
            return res.status(404).json({ message: "Booking not found" });

        booking.startDate = req.body.startDate;
        booking.endDate = req.body.endDate;
        await booking.save();

        await sendEmail(
            req.user.email,
            "Booking Updated",
            emailTemplate(
                "Booking Updated",
                "Your booking dates have been updated!",
                booking,
                booking.vehicle
            )
        );

        res.json({ message: "Booking Updated! Email Sent!" });
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};

// ============================
//  Cancel Booking
// ============================
export const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("vehicle");
        if (!booking)
            return res.status(404).json({ message: "Booking not found" });

        booking.status = "cancelled";
        await booking.save();

        await sendEmail(
            req.user.email,
            "Booking Cancelled",
            emailTemplate(
                "Booking Cancelled",
                "Your booking has been cancelled!",
                booking,
                booking.vehicle
            )
        );

        res.json({ message: "Booking Cancelled! Email Sent!" });
    } catch (error) {
        res.status(500).json({ message: "Cancel failed", error: error.message });
    }
};

// ============================
//  Admin → Get ALL Bookings (Paginated)
// ============================
export const getAllBookings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Booking.countDocuments();

        const bookings = await Booking.find()
            .populate("user", "name email")
            .populate("vehicle", "make model pricePerDay location")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.json({
            data: bookings,
            total,
            page,
            limit,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch all bookings",
            error: error.message
        });
    }
};
