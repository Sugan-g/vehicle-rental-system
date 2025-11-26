import multer from "multer";
import path from "path";

// Folder to store uploaded images
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/vehicles/");  // Folder where images will be stored
    },
    filename(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // Unique file name with extension
    },
});

// Set up multer to use the storage configuration
const upload = multer({ storage });

export default upload;
