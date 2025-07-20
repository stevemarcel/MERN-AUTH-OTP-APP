import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Defining __filename, __dirname and the path to the default placeholder image
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const PLACEHOLDER_PROFILE_IMAGE = "/uploads/profiles/placeholder.png";

// Define the correct upload directory relative to the project root
// IMPORTANT: Corrected path to go up two levels from 'backend/utils' to 'project_root'
const uploadDir = path.join(__dirname, "../uploads/profiles");

// Ensure the upload directory exists
fs.mkdirSync(uploadDir, { recursive: true }); // ADDED: Ensure the directory exists

// Storage for uploaded files at 'backend/uploads/profiles'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Storage folder
    cb(null, uploadDir);
  },
  // Name uploaded file using a timestamp, a random number, and the original filename
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to ensure only image files (JPEG, JPG, PNG, GIF) are allowed
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype); // Check mimetype - This tells the server what kind of file was uploaded
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  // If it is an image file, accept the file
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images (JPEG, JPG, PNG, GIF) are allowed!"), false);
  }
};

// File size limit in MB
const fileSizeLimit = 3;

// Configure the multer upload middleware with storage, filter, and file size limit
const uploadProfileImage = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: fileSizeLimit * 1024 * 1024 }, // Set file size limit
});

export default uploadProfileImage;
