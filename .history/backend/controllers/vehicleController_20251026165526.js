import Vehicle from "../models/Vehicle.js";

export const getVehicles = async (req, res) => {
    const vehicles = await Vehicle.find({});
    res.json(vehicles);
};

export const getVehicleById = async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) res.json(vehicle);
    else res.status(404).json({ message: "Vehicle not found" });
};

export const createVehicle = async (req, res) => {
    const vehicle = new Vehicle(req.body);
    const createdVehicle = await vehicle.save();
    res.status(201).json(createdVehicle);
};

export const updateVehicle = async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
        Object.assign(vehicle, req.body);
        const updatedVehicle = await vehicle.save();
        res.json(updatedVehicle);
    } else {
        res.status(404).json({ message: "Vehicle not found" });
    }
};

export const deleteVehicle = async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
        await vehicle.remove();
        res.json({ message: "Vehicle removed" });
    } else {
        res.status(404).json({ message: "Vehicle not found" });
    }
};
