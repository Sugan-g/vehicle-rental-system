import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
} from "../controllers/vehicleController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getVehicles);            // GET /api/vehicles
router.get("/:id", getVehicleById);      // GET /api/vehicles/:id

// Admin-only routes
router.post(
    "/",
    protect,
    admin,
    upload.single("image"),
    createVehicle
);                                      // POST /api/vehicles

router.put(
    "/:id",
    protect,
    admin,
    upload.single("image"),
    updateVehicle
);                                      // PUT /api/vehicles/:id

router.delete("/:id", protect, admin, deleteVehicle); // DELETE /api/vehicles/:id

export default router;
