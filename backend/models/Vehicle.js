import mongoose from "mongoose";

// Define the Vehicle schema
const VehicleSchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    images: { type: [String], default: [] },
    available: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Vehicle", VehicleSchema);
