import multer from "multer";
import path from "path";

// Store uploaded product images in memory.
// The file will be sent directly to Cloudinary.
const storage = multer.memoryStorage();

// Only allow image files.
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;

  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }

  cb(new Error("Only images (JPEG, JPG, PNG, GIF) are allowed!"), false);
};

const fileSizeLimit = 3;

const uploadProductImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: fileSizeLimit * 1024 * 1024,
  },
});

export default uploadProductImage;
