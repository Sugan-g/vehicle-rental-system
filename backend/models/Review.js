import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    rating: { type: Number, required: true },
    comment: String,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Review", ReviewSchema);
