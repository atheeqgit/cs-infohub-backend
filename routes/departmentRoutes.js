import express from "express";
import {
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getAllData,
} from "../controllers/departmentController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import cloudinaryUpload from "../utilities/cloudinary-upload.js";
import upload from "../utilities/multer.cjs";

const router = express.Router();

// getting the home page data
router.get("/home/:pathName", getDepartment);

// getting all data of singly type by the department    EG: all faculty belongs to the department ... ect
router.get(
  "/getAllData/:deptID/:type",
  authenticate,
  authorize(["superAdmin", "admin"]),
  getAllData
);

// create department route
router.post(
  "/create-department",
  authenticate,
  authorize(["superAdmin"]),
  upload,
  cloudinaryUpload,
  createDepartment
);

// update department HomePage data
router.put(
  "/update-department/:pathName",
  authenticate,
  authorize(["superAdmin", "admin"]),
  upload,
  cloudinaryUpload,
  updateDepartment
);

// delete Department
router.delete(
  "/delete-department/:id",
  authenticate,
  authorize(["superAdmin"]),
  deleteDepartment
);

export default router;
