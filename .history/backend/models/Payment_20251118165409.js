import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        checkoutSessionId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "paid", "failed", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
