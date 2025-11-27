import multer from "multer";

// Use memoryStorage for Cloudinary
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
