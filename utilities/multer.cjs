const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

// Ensure 'uploads' directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Use the created 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname)); // Unique file name
  },
});

// Multer File Filter (Allow only specific file types)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg", // Images
    "video/mp4",
    "video/mpeg",
    "video/quicktime", // Videos
    "application/pdf", // PDFs
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Docs
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false); // Reject file silently without throwing an error
  }
};

// Allow multiple files with dynamic field names but don't throw errors if no files
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Optional: Set max file size to 10MB
}).any(); // .any() allows any fields with files

module.exports = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: "Multer error: " + err.message });
    } else if (err) {
      return res.status(500).json({ error: "Server error: " + err.message });
    }
    next(); // Continue if there are no errors
  });
};
