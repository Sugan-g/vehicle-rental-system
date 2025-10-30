import Vehicle from "../models/Vehicle.js";

//  Get all vehicles
export const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({});

        const formatted = vehicles.map(v => ({
            _id: v._id,
            make: v.make,
            model: v.model,
            year: v.year,
            location: v.location,
            // Show correct price no matter old/new data
            pricePerDay: v.pricePerDay ?? v.price ?? 0,
            // Support both image and images[]
            image: v.images?.[0] || "",
            images: v.images || [],
            description: v.description || "",
            type: v.type || "",
            available: v.available,
            createdAt: v.createdAt
        }));

        res.json(formatted);
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get single vehicle by ID
export const getVehicleById = async (req, res) => {
    try {
        const v = await Vehicle.findById(req.params.id);

        if (!v) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        const normalized = {
            _id: v._id,
            make: v.make,
            model: v.model,
            year: v.year,
            location: v.location,
            // Handle pricePerDay fallback
            pricePerDay: v.pricePerDay ?? v.price ?? 0,
            image: v.images?.[0] || "",
            images: v.images || [],
            description: v.description || "",
            type: v.type || "",
            available: v.available,
            createdAt: v.createdAt
        };

        res.json(normalized);
    } catch (error) {
        console.error("Error fetching vehicle:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Create new vehicle
export const createVehicle = async (req, res) => {
    try {
        const vehicle = new Vehicle(req.body);
        const created = await vehicle.save();
        res.status(201).json(created);
    } catch (error) {
        console.error("Error creating vehicle:", error);
        res.status(500).json({ message: "Failed to create vehicle", error: error.message });
    }
};

//  Update existing vehicle
export const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        Object.assign(vehicle, req.body);
        const updated = await vehicle.save();
        res.json(updated);
    } catch (error) {
        console.error("Error updating vehicle:", error);
        res.status(500).json({ message: "Failed to update vehicle", error: error.message });
    }
};

// 🟢 Delete a vehicle
export const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        await vehicle.deleteOne();
        res.json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        console.error("Error deleting vehicle:", error);
        res.status(500).json({ message: "Failed to delete vehicle", error: error.message });
    }
};
