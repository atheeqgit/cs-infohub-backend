import express from "express";
import {
  addEcontent,
  updateEcontent,
  deleteEcontent,
  getAllPrograms,
  getAllEcontentsBySem,
  // getNumberOfEcontents,
  getAllEcontentsBySearch,
} from "../controllers/econtentController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import cloudinaryUpload from "../utilities/cloudinary-upload.js";
import upload from "../utilities/multer.cjs";

const router = express.Router();

// Create e-content route
router.get("/getAll-programs/:deptID", getAllPrograms);

router.get("/getAll-econtents/:progID/:sem", getAllEcontentsBySem);
// search
router.get("/global-search/e-content", getAllEcontentsBySearch);

// router.get("/getTotal-econtents/:progID", getNumberOfEcontents);
// Create e-content route
router.post(
  "/create-eContent",
  authenticate,
  authorize(["superAdmin", "admin"]),
  upload,
  cloudinaryUpload,
  addEcontent
);

// Update e-content
router.put(
  "/update-eContent/:id",
  authenticate,
  authorize(["superAdmin", "admin"]),
  upload,
  cloudinaryUpload,
  updateEcontent
);

// Delete e-content
router.delete(
  "/delete-eContent/:id",
  authenticate,
  authorize(["superAdmin", "admin"]),
  deleteEcontent
);

export default router;
