import express from "express";
import {
  addEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import cloudinaryUpload from "../utilities/cloudinary-upload.js";
import upload from "../utilities/multer.cjs";

const router = express.Router();

// create department route
router.post(
  "/create-event/:deptID",
  authenticate,
  authorize(["superAdmin", "admin"]),
  upload,
  cloudinaryUpload,
  addEvent
);

// update department HomePage data
router.put(
  "/update-event/:id",
  authenticate,
  authorize(["superAdmin", "admin"]),
  upload,
  cloudinaryUpload,
  updateEvent
);

// delete Department
router.delete(
  "/delete-event/:id",
  authenticate,
  authorize(["superAdmin", "admin"]),
  deleteEvent
);

export default router;
