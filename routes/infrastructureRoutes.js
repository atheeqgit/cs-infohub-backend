import express from "express";
import {
  addInfrastructure,
  updateInfrastructure,
  deleteInfrastructure,
} from "../controllers/infrastructureController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import cloudinaryUpload from "../utilities/cloudinary-upload.js";
import upload from "../utilities/multer.cjs";

const router = express.Router();

// create department route
router.post(
  "/create-infrastructure/:deptID",
  authenticate,
  authorize(["superAdmin", "admin"]),
  upload,
  cloudinaryUpload,
  addInfrastructure
);

// update department HomePage data
router.put(
  "/update-infrastructure/:id",
  authenticate,
  authorize(["superAdmin", "admin"]),
  upload,
  cloudinaryUpload,
  updateInfrastructure
);

// delete Department
router.delete(
  "/delete-infrastructure/:id",
  authenticate,
  authorize(["superAdmin", "admin"]),
  deleteInfrastructure
);

export default router;
