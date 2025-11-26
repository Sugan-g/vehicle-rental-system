import Vehicle from "../models/Vehicle.js";

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

        const formatted = vehicles.map(v => ({
            _id: v._id,
            make: v.make,
            model: v.model,
            year: v.year,
            location: v.location,
            pricePerDay: v.pricePerDay ?? v.price ?? 0,
            image: v.images?.[0] || "",
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
        const v = await Vehicle.findById(req.params.id);
        if (!v) {
            return sendResponse(res, 404, false, "Vehicle not found");
        }

        const formatted = {
            _id: v._id,
            make: v.make,
            model: v.model,
            year: v.year,
            location: v.location,
            pricePerDay: v.pricePerDay ?? v.price ?? 0,
            image: v.images?.[0] || "",
            images: v.images || [],
            description: v.description || "",
            type: v.type || "",
            available: v.available,
            createdAt: v.createdAt
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
        const required = ["make", "model", "year", "pricePerDay"];
        for (let field of required) {
            if (!req.body[field]) {
                return sendResponse(res, 400, false, `${field} is required`);
            }
        }

        const vehicle = new Vehicle(req.body);
        const created = await vehicle.save();

        return sendResponse(res, 201, true, "Vehicle created successfully", created);

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

        Object.assign(vehicle, req.body); // Update the vehicle fields with new data
        const updated = await vehicle.save();

        return sendResponse(res, 200, true, "Vehicle updated successfully", updated);

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

        await vehicle.deleteOne(); // Delete the vehicle
        return sendResponse(res, 200, true, "Vehicle deleted successfully");

    } catch (error) {
        console.error("Error deleting vehicle:", error);
        return sendResponse(res, 500, false, "Failed to delete vehicle", error.message);
    }
};
