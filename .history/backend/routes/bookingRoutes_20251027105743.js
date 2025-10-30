// routes/bookingRoutes.js
import express from "express";
import {
    createBooking,
    getMyBookings,
    updateBooking,
    cancelBooking,
} from "../controllers/bookingController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.put("/:id", protect, updateBooking);
router.patch("/:id/cancel", protect, cancelBooking);

export default router;
