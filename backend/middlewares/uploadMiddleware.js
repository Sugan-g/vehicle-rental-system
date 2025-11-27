import multer from "multer";
import path from "path";
import fs from "fs";

// Persistent disk folder
const uploadFolder = "/mnt/data/uploads/vehicles/";

// Ensure folder exists
fs.mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadFolder);
    },
    filename(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

export default upload;
