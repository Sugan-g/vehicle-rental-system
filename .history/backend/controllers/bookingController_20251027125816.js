import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";
import { sendEmail } from "../utils/emailService.js";

// ✅ Create Booking
export const createBooking = async (req, res) => {
    try {
        const { vehicleId, startDate, endDate } = req.body;
        const user = req.user;

        const booking = await Booking.create({
            user: user._id,
            vehicle: vehicleId,
            startDate,
            endDate
        });

        await sendEmail(
            user.email,
            "Booking Confirmed ✅",
            `<h3>Your booking is confirmed!</h3><p>From: ${startDate}<br>To: ${endDate}</p>`
        );

        res.json({ message: "Booking created successfully!", booking });
    } catch (error) {
        res.status(500).json({ message: "Booking failed", error });
    }
};

// ✅ Update Booking (dates)
export const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        await sendEmail(
            req.user.email,
            "Booking Updated ✏️",
            `<h3>Your booking dates were updated.</h3>
      <p>New From: ${booking.startDate}<br>New To: ${booking.endDate}</p>`
        );

        res.json({ message: "Booking updated", booking });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};

// ✅ Cancel Booking
export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        booking.status = "cancelled";
        await booking.save();

        await sendEmail(
            req.user.email,
            "Booking Cancelled ❌",
            `<h3>Your booking has been cancelled.</h3><p>Vehicle: ${booking.vehicle}</p>`
        );

        res.json({ message: "Booking cancelled successfully" });
    } catch (error) {
        res.status(500).json({ message: "Cancel failed" });
    }
};
