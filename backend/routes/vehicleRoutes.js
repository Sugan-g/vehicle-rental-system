import express from "express";
import upload from "../middlewares/uploadMiddleware.js"; // File upload middleware
import {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
} from "../controllers/vehicleController.js";  // Controller functions
import { protect, admin } from "../middlewares/authMiddleware.js";  // Authentication and Admin authorization middleware

const router = express.Router();

// Public routes
router.get("/vehicles", getVehicles); // Get all vehicles
router.get("/vehicles/:id", getVehicleById); // Get a single vehicle by ID

// Admin-only routes (protected routes)
router.post(
    "/vehicles",
    protect,
    admin,
    upload.single("image"), // Handle image upload using Multer (optional)
    createVehicle
);

router.put(
    "/vehicles/:id",
    protect,
    admin,
    upload.single("image"), // Handle image upload using Multer (optional)
    updateVehicle
);

router.delete("/vehicles/:id", protect, admin, deleteVehicle); // Delete a vehicle by ID

export default router;
