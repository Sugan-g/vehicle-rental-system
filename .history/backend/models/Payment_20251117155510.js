import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    orderId: String,
    paymentId: String,
    signature: String,
    amount: Number,
    status: {
        type: String,
        enum: ["SUCCESS", "FAILED"],
        default: "FAILED",
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Payment", paymentSchema);
