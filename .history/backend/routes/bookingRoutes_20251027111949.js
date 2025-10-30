import express from "express";
import {
    createBooking,
    getMyBookings,
    cancelBooking,
    deleteBooking,
} from "../controllers/bookingController.js";
import auth from "../middlewares/authMiddlware.js";

const router = express.Router();

router.post("/", auth, createBooking);
router.get("/my", auth, getMyBookings);
router.put("/:id/cancel", auth, cancelBooking);
router.delete("/:id", auth, deleteBooking);

export default router;
