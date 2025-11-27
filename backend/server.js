import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import fs from "fs";             // <-- Added
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
connectDB();

const app = express();

// -------------------------------------------
// ✅ CREATE UPLOAD FOLDERS ON RENDER
// -------------------------------------------
const baseUploadPath = "/mnt/data/uploads";
const vehicleUploadPath = "/mnt/data/uploads/vehicles";

// Create folder structure
fs.mkdirSync(baseUploadPath, { recursive: true });
fs.mkdirSync(vehicleUploadPath, { recursive: true });
// -------------------------------------------

// CORS must come before JSON/body parsers
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:3000",
            "https://euphonious-vacherin-dbadc7.netlify.app",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json());
app.use(cookieParser());

// Test API
app.get("/api/test", (req, res) => {
    res.json({ message: "API working fine ✅" });
});

// -------------------------------------------
// ✅ Serve uploaded files from persistent disk
// -------------------------------------------
app.use("/uploads", express.static("/mnt/data/uploads"));

// Optional existing static folders
app.use("/images", express.static(path.join(process.cwd(), "images")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
