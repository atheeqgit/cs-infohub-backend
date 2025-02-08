import express from "express";
import {
  loginAdmin,
  registerAdmin,
  deleteAdmin,
  registerSuperAdmin,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

// Register for superAdmins
router.post(
  "/register-superadmin",
  authenticate,
  authorize(["superAdmin"]),
  registerSuperAdmin
);

// login route for both admin and superAdmins
router.post("/admin/login", loginAdmin);

// the below routes can be accessed only by superAdmins
router.post(
  "/admin/register",
  authenticate,
  authorize(["superAdmin"]),
  registerAdmin
);

router.delete(
  "/admin/delete/:id",
  authenticate,
  authorize(["superAdmin"]),
  deleteAdmin
);

export default router;

// MYTOKEN eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzk2NmJiY2JmZjg3ZWIxYjhjN2UxMzYiLCJyb2xlIjoic3VwZXJBZG1pbiIsImlhdCI6MTczNzkxMTI3MCwiZXhwIjoxNzM5MjA3MjcwfQ.5k-0NA5TDkKVjz2t_rJlusA9Z7VyF9Lyj4WInocpICs
