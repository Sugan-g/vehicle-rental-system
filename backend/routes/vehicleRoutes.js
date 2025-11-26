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
router.get("/", getVehicles);
router.get("/:id", getVehicleById);

// Admin routes
router.post(
    "/",
    protect,
    admin,
    upload.single("image"),  // added multer
    createVehicle
);

router.put(
    "/:id",
    protect,
    admin,
    upload.single("image"), // optional for edit
    updateVehicle
);

router.delete("/:id", protect, admin, deleteVehicle);

export default router;
