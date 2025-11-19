import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: Number,
    currency: String,
    sessionId: String,
    status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Payment", PaymentSchema);
