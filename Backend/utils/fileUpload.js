import multer from "multer";
import path from "path";

export const PLACEHOLDER_PROFILE_IMAGE = "/uploads/profiles/placeholder.png";

// Store uploaded files in memory instead of Render's filesystem.
// Cloudinary will receive the file buffer directly.
const storage = multer.memoryStorage();

// File filter to ensure only image files are allowed.
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;

  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }

  cb(new Error("Only images (JPEG, JPG, PNG, GIF) are allowed!"), false);
};

// File size limit: 3 MB
const fileSizeLimit = 3;

const uploadProfileImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: fileSizeLimit * 1024 * 1024,
  },
});

export default uploadProfileImage;
