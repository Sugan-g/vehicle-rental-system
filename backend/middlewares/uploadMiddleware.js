import multer from "multer";
import path from "path";

// Folder to store uploaded images
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/vehicles/");
    },
    filename(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

export default upload;
