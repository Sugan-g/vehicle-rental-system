    import Booking from "../models/Booking.js";
    import Vehicle from "../models/Vehicle.js";
    import sendEmail from "../utils/sendEmail.js";

    // ✅ Create Booking
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
                `<h3>Your vehicle booking is confirmed!</h3>
                <p>${vehicle.make} ${vehicle.model}</p>`
            );

            res.json(booking);
        } catch (error) {
            res.status(500).json({ message: "Booking failed", error });
        }
    };

    // ✅ Get user's bookings
    export const getMyBookings = async (req, res) => {
        try {
            const bookings = await Booking.find({ user: req.user._id })
                .populate("vehicle");
            res.json(bookings);
        } catch (error) {
            res.status(500).json({ message: "Error fetching bookings" });
        }
    };

    // ✅ Get single booking for Edit page
    export const getBookingById = async (req, res) => {
        try {
            const booking = await Booking.findById(req.params.id);
            res.json(booking);
        } catch (error) {
            res.status(500).json({ message: "Not found" });
        }
    };

    // ✅ Update Booking + Send email
    export const updateBooking = async (req, res) => {
        try {
            const booking = await Booking.findById(req.params.id).populate("vehicle");

            booking.startDate = req.body.startDate;
            booking.endDate = req.body.endDate;
            await booking.save();

            await sendEmail(
                req.user.email,
                "Booking Updated ✅",
                `<h3>Your booking period has been updated!</h3>
                <p>${booking.vehicle.make} ${booking.vehicle.model}</p>`
            );

            res.json({ message: "Booking Updated ✅ Email sent!" });
        } catch (error) {
            res.status(500).json({ message: "Update failed" });
        }
    };

    // ✅ Cancel Booking + Send email
    export const deleteBooking = async (req, res) => {
        try {
            const booking = await Booking.findById(req.params.id).populate("vehicle");
            booking.status = "cancelled";
            await booking.save();

            await sendEmail(
                req.user.email,
                "Booking Cancelled ❌",
                `<h3>Your booking has been cancelled.</h3>
                <p>${booking.vehicle.make} ${booking.vehicle.model}</p>`
            );

            res.json({ message: "Booking cancelled ✅ Email sent!" });
        } catch (error) {
            res.status(500).json({ message: "Cancel failed" });
        }
    };
