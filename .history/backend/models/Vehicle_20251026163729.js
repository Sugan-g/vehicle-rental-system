const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    make: String,
    model: String,
    year: Number,
    pricePerDay: Number,
    location: String,
    type: String,
    images: [String],
    available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", vehicleSchema);
