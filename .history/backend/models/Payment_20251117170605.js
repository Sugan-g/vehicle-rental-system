import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true
    },
    amount: Number,
    currency: { type: String, default: "inr" },
    status: { type: String, default: "pending" }, // pending, paid, failed
    paymentIntentId: String,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Payment", PaymentSchema);
