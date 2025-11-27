import Vehicle from "../models/Vehicle.js";

//  IMPORTANT FIX → use your config file instead of raw cloudinary
import cloudinary from "../config/cloudinary.js";

// Helper: Send response
const sendResponse = (res, status, success, message, data = null) => {
    return res.status(status).json({ success, message, data });
};

// Cloudinary Upload Helper (Promise wrapper)
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "vehicles",
                resource_type: "image",
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(fileBuffer);
    });
};

// -----------------------------------------------------
// Get All Vehicles
// -----------------------------------------------------
export const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({}).sort({ createdAt: -1 });

        const formatted = vehicles.map(v => ({
            _id: v._id,
            make: v.make,
            model: v.model,
            year: v.year,
            location: v.location,
            pricePerDay: v.pricePerDay ?? v.price ?? 0,
            image: v.images?.[0] || "",
            images: v.images || [],
            description: v.description,
            type: v.type,
            available: v.available,
            createdAt: v.createdAt
        }));

        return sendResponse(res, 200, true, "Vehicles fetched successfully", formatted);

    } catch (error) {
        console.error("Error fetching vehicles:", error);
        return sendResponse(res, 500, false, "Server error while fetching vehicles", error.message);
    }
};

// -----------------------------------------------------
// Get Single Vehicle
// -----------------------------------------------------
export const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) return sendResponse(res, 404, false, "Vehicle not found");

        const formatted = {
            _id: vehicle._id,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            location: vehicle.location,
            pricePerDay: vehicle.pricePerDay ?? vehicle.price ?? 0,
            image: vehicle.images?.[0] || "",
            images: vehicle.images || [],
            description: vehicle.description,
            type: vehicle.type,
            available: vehicle.available,
            createdAt: vehicle.createdAt
        };

        return sendResponse(res, 200, true, "Vehicle fetched successfully", formatted);

    } catch (error) {
        console.error("Error fetching vehicle:", error);
        return sendResponse(res, 500, false, "Server error while fetching vehicle", error.message);
    }
};

// -----------------------------------------------------
// Create Vehicle
// -----------------------------------------------------
export const createVehicle = async (req, res) => {
    try {
        const required = ["make", "model", "year", "pricePerDay"];
        for (let f of required) {
            if (!req.body[f]) return sendResponse(res, 400, false, `${f} is required`);
        }

        let imageUrl = "";

        // Cloudinary upload instead of local
        if (req.file) {
            const uploaded = await uploadToCloudinary(req.file.buffer);
            imageUrl = uploaded.secure_url;
        }

        const vehicleData = {
            make: req.body.make,
            model: req.body.model,
            year: req.body.year,
            pricePerDay: req.body.pricePerDay,
            location: req.body.location,
            type: req.body.type,
            description: req.body.description,
            available: req.body.isAvailable,
            images: imageUrl ? [imageUrl] : []
        };

        const newVehicle = await Vehicle.create(vehicleData);

        return sendResponse(res, 201, true, "Vehicle created successfully", newVehicle);

    } catch (error) {
        console.error("Error creating vehicle:", error);
        return sendResponse(res, 500, false, "Failed to create vehicle", error.message);
    }
};

// -----------------------------------------------------
// Update Vehicle
// -----------------------------------------------------
export const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle)
            return sendResponse(res, 404, false, "Vehicle not found");

        Object.assign(vehicle, req.body);

        // If image uploaded, replace existing one
        if (req.file) {
            const uploaded = await uploadToCloudinary(req.file.buffer);
            vehicle.images = [uploaded.secure_url];
        }

        const updatedVehicle = await vehicle.save();

        return sendResponse(res, 200, true, "Vehicle updated successfully", updatedVehicle);

    } catch (error) {
        console.error("Error updating vehicle:", error);
        return sendResponse(res, 500, false, "Failed to update vehicle", error.message);
    }
};

// -----------------------------------------------------
// Delete Vehicle
// -----------------------------------------------------
export const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle)
            return sendResponse(res, 404, false, "Vehicle not found");

        await vehicle.deleteOne();

        return sendResponse(res, 200, true, "Vehicle deleted successfully");

    } catch (error) {
        console.error("Error deleting vehicle:", error);
        return sendResponse(res, 500, false, "Failed to delete vehicle", error.message);
    }
};
