import express from "express";
import { updateAbout } from "../controllers/aboutController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

// create about route
router.put(
  "/update-about/:pathName",
  authenticate,
  authorize(["superAdmin", "admin"]),
  updateAbout
);

export default router;
