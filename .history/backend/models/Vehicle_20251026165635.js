import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema({
    make: String,
    model: String,
    year: Number,
    pricePerDay: Number,
    location: String,
    type: String,
    images: [String],
    available: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Vehicle", VehicleSchema);
