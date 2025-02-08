import express from "express";
import {
  addFaculty,
  updateFaculty,
  deleteFaculty,
} from "../controllers/facultyController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import cloudinaryUpload from "../utilities/cloudinary-upload.js";
import upload from "../utilities/multer.cjs";

const router = express.Router();

// create faculty bu dept id
router.post(
  "/create-faculty/:deptID",
  authenticate,
  authorize(["superAdmin", "admin"]),
  upload,
  cloudinaryUpload,
  addFaculty
);

// update department faculty data
router.put(
  "/update-faculty/:facultyID",
  authenticate,
  authorize(["superAdmin", "admin"]),
  upload,
  cloudinaryUpload,
  updateFaculty
);

// delete Department
router.delete(
  "/delete-faculty/:facultyID",
  authenticate,
  authorize(["superAdmin", "admin"]),
  deleteFaculty
);

export default router;
