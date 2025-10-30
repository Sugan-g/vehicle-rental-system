import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    paymentStatus: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Booking", BookingSchema);
