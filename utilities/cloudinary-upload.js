import fs from "fs";
import path from "path";
import cloudinary from "./cloudinary-config.js";

// Middleware for Cloudinary Upload
const cloudinaryUpload = async (req, res, next) => {
  if (!req.files || req.files.length < 1) {
    return next();
  }

  try {
    const uploadedFiles = [];

    for (const file of req.files) {
      const filePath = file.path;
      const fileType = file.mimetype;

      // Determine Cloudinary Folder based on file type
      let folder = "uploads"; // Default folder
      if (fileType.startsWith("image/")) folder = "images";
      else if (fileType.startsWith("video/")) folder = "videos";
      else if (fileType === "application/pdf") folder = "pdfs";
      else if (fileType.includes("word") || fileType.includes("excel"))
        folder = "documents";
      else return res.status(400).json({ error: "Unsupported file type" });

      // Upload file to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
        folder: folder,
        resource_type: fileType.startsWith("video/") ? "video" : "auto",
      });

      fs.unlinkSync(filePath); // Delete file after upload

      // Save uploaded file's Cloudinary URL in req.body dynamically
      console.log("uploaded file pID:" + cloudinaryResponse.public_id);
      uploadedFiles.push({
        fieldName: file.fieldname, // Example: "imgSrc", "pdfLink"
        url: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id, // Store public ID for deletion
      });
    }

    req.cloudinaryFiles = uploadedFiles; // Attach to request object

    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default cloudinaryUpload;
