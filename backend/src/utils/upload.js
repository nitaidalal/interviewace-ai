import multer from "multer";
import ApiError from "./ApiError.js";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_SIZE_MB = 2;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new ApiError(400, "Only JPEG, PNG, and WebP images are allowed"),
      false,
    );
  }
  cb(null, true);
};

export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE_MB * 1024 * 1024,
  },
}).single("avatar");

export const uploadResume = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new ApiError(400, "Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: MAX_SIZE_MB * 1024 * 1024, 
  },
}).single("resume");
