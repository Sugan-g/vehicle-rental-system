import Vehicle from "../models/Vehicle.js";
import cloudinary from "cloudinary";  // If you're using Cloudinary for image storage (optional)

// Unified response helper
const sendResponse = (res, status, success, message, data = null) => {
    return res.status(status).json({ success, message, data });
};

// -----------------------------------------------------
// Get All Vehicles
// -----------------------------------------------------
export const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({}).sort({ createdAt: -1 });

        // Format the vehicle data before sending it as a response
        const formatted = vehicles.map(v => ({
            _id: v._id,
            make: v.make,
            model: v.model,
            year: v.year,
            location: v.location,
            pricePerDay: v.pricePerDay ?? v.price ?? 0,
            image: v.images?.[0] || "",  // First image URL
            images: v.images || [],
            description: v.description || "",
            type: v.type || "",
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
// Get Single Vehicle by ID
// -----------------------------------------------------
export const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return sendResponse(res, 404, false, "Vehicle not found");
        }

        // Format the vehicle data before sending it
        const formatted = {
            _id: vehicle._id,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            location: vehicle.location,
            pricePerDay: vehicle.pricePerDay ?? vehicle.price ?? 0,
            image: vehicle.images?.[0] || "",
            images: vehicle.images || [],
            description: vehicle.description || "",
            type: vehicle.type || "",
            available: vehicle.available,
            createdAt: vehicle.createdAt
        };

        return sendResponse(res, 200, true, "Vehicle details fetched successfully", formatted);
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
        // Validate required fields
        const required = ["make", "model", "year", "pricePerDay"];
        for (let field of required) {
            if (!req.body[field]) {
                return sendResponse(res, 400, false, `${field} is required`);
            }
        }

        // Handle image upload (optional, if image is uploaded)
        let imageUrl = "";
        if (req.file) {
            // Image upload logic (using Cloudinary or storing locally)
            imageUrl = req.file.path;  // Save local path to the image (if storing locally)
            // If you're using Cloudinary for image storage:
            // const result = await cloudinary.v2.uploader.upload(req.file.path);
            // imageUrl = result.secure_url;  // Cloudinary image URL
        }

        // Create the vehicle data
        const vehicleData = {
            make: req.body.make,
            model: req.body.model,
            year: req.body.year,
            pricePerDay: req.body.pricePerDay,
            location: req.body.location,
            type: req.body.type,
            description: req.body.description,
            available: req.body.isAvailable,
            images: imageUrl ? [imageUrl] : [],  // Save the image URL in the images array
        };

        // Create the vehicle and save it to the database
        const vehicle = new Vehicle(vehicleData);
        const createdVehicle = await vehicle.save();

        return sendResponse(res, 201, true, "Vehicle created successfully", createdVehicle);
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

        if (!vehicle) {
            return sendResponse(res, 404, false, "Vehicle not found");
        }

        // Update vehicle fields with new data from the request body
        Object.assign(vehicle, req.body);

        // If a new image is uploaded, update the images array
        if (req.file) {
            const imageUrl = req.file.path;  // Save local path (if storing locally)
            // If using Cloudinary for images:
            // const result = await cloudinary.v2.uploader.upload(req.file.path);
            // vehicle.images = [result.secure_url];
            vehicle.images = [imageUrl];  // Save the new image URL
        }

        // Save the updated vehicle
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

        if (!vehicle) {
            return sendResponse(res, 404, false, "Vehicle not found");
        }

        // Delete the vehicle
        await vehicle.deleteOne();

        return sendResponse(res, 200, true, "Vehicle deleted successfully");
    } catch (error) {
        console.error("Error deleting vehicle:", error);
        return sendResponse(res, 500, false, "Failed to delete vehicle", error.message);
    }
};
