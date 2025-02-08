import express from "express";
import {
  addProgram,
  updateProgram,
  deleteProgram,
} from "../controllers/programController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
// import cloudinaryUpload from "../utilities/cloudinary-upload.js";
// import upload from "../utilities/multer.cjs";

const router = express.Router();

// create department route
router.post(
  "/create-program/:deptID",
  authenticate,
  authorize(["superAdmin", "admin"]),
  addProgram
);

// update department HomePage data
router.put(
  "/update-program/:id",
  authenticate,
  authorize(["superAdmin", "admin"]),
  updateProgram
);

// delete Department
router.delete(
  "/delete-program/:id",
  authenticate,
  authorize(["superAdmin", "admin"]),
  deleteProgram
);

export default router;
