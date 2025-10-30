import Vehicle from "../models/Vehicle.js";

// Get all vehicles
export const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({});

        const formatted = vehicles.map(v => ({
            _id: v._id,
            make: v.make,
            model: v.model,
            year: v.year,
            location: v.location,
            pricePerDay: v.pricePerDay || v.price || 0,
            image: v.image || "",
            description: v.description || "",
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get a single vehicle by ID
export const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // Normalize field names for consistency
        const normalizedVehicle = {
            _id: vehicle._id,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            location: vehicle.location,
            pricePerDay: vehicle.pricePerDay || vehicle.price || 0,
            image: vehicle.image || "",
            description: vehicle.description || "",
        };

        res.json(normalizedVehicle);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Create a new vehicle
export const createVehicle = async (req, res) => {
    try {
        const vehicle = new Vehicle(req.body);
        const createdVehicle = await vehicle.save();
        res.status(201).json(createdVehicle);
    } catch (error) {
        res.status(500).json({ message: "Failed to create vehicle", error: error.message });
    }
};

// Update vehicle details
export const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (vehicle) {
            Object.assign(vehicle, req.body);
            const updatedVehicle = await vehicle.save();
            res.json(updatedVehicle);
        } else {
            res.status(404).json({ message: "Vehicle not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to update vehicle", error: error.message });
    }
};

// ✅ Delete a vehicle
export const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (vehicle) {
            await vehicle.deleteOne();
            res.json({ message: "Vehicle removed successfully" });
        } else {
            res.status(404).json({ message: "Vehicle not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to delete vehicle", error: error.message });
    }
};
