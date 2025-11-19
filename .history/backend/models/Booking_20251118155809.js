import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        vehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["booked", "cancelled"],
            default: "booked",
        },
        startDate: Date,
        endDate: Date,
        totalAmount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
