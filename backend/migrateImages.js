import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Vehicle from "./models/Vehicle.js";
import cloudinary from "./config/cloudinary.js";

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));

// Cloudinary upload helper
const uploadToCloudinary = (filePath) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(filePath, { folder: "vehicles" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

const migrateImages = async () => {
    try {
        const vehicles = await Vehicle.find({});

        for (let vehicle of vehicles) {
            const updatedImages = [];

            if (vehicle.images && vehicle.images.length > 0) {
                for (let img of vehicle.images) {
                    // Only migrate local paths
                    if (img.startsWith("/uploads/")) {
                        const localPath = path.join(process.cwd(), img);
                        if (fs.existsSync(localPath)) {
                            const uploaded = await uploadToCloudinary(localPath);
                            updatedImages.push(uploaded.secure_url);
                            console.log(`Uploaded: ${img} -> ${uploaded.secure_url}`);
                        } else {
                            console.log(`File not found: ${img}`);
                        }
                    } else {
                        // Already a Cloudinary URL
                        updatedImages.push(img);
                    }
                }

                vehicle.images = updatedImages;
                await vehicle.save();
            }
        }

        console.log("Migration complete!");
        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

migrateImages();
