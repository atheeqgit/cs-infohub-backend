import express from "express";
import {
  addCareer,
  updateCareer,
  deleteCareer,
} from "../controllers/careerController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import cloudinaryUpload from "../utilities/cloudinary-upload.js";
import upload from "../utilities/multer.cjs";

const router = express.Router();

// create department route
router.post(
  "/create-career/:deptID",
  authenticate,
  authorize(["superAdmin", "admin"]),
  upload,
  cloudinaryUpload,
  addCareer
);

// update department HomePage data
router.put(
  "/update-career/:id",
  authenticate,
  authorize(["superAdmin", "admin"]),
  upload,
  cloudinaryUpload,
  updateCareer
);

// delete Department
router.delete(
  "/delete-career/:id",
  authenticate,
  authorize(["superAdmin", "admin"]),
  deleteCareer
);

export default router;
