import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";

export const createBooking = async (req, res) => {
    try {
        const { vehicleId } = req.body;

        if (!vehicleId) {
            return res.status(400).json({ message: "Vehicle ID required" });
        }

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

        const booking = await Booking.create({
            vehicle: vehicleId,
            user: req.user._id,
            status: "booked",
            startDate: new Date(),
            endDate: new Date(),
            totalAmount: vehicle.pricePerDay,
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate("vehicle", "make model images pricePerDay");

        res.json(bookings);
    } catch (error) {
        console.error("Get bookings error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to cancel this booking" });
        }

        booking.status = "cancelled";
        await booking.save();

        res.json({ message: "Booking cancelled", booking });
    } catch (error) {
        console.error("Cancel error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        await booking.deleteOne();
        res.json({ message: "Booking removed" });
    } catch (error) {
        console.error("Delete booking error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
