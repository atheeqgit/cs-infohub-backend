import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const generateToken = (admin) => {
  const token = jwt.sign(
    { _id: admin._id, role: admin.role },
    "thisIsTheScrectForThisDataBase",
    { expiresIn: "15d" }
  );

  return token;
};

export const registerSuperAdmin = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const existingSuperAdmin = await Admin.findOne({ role: "superAdmin" });
    if (existingSuperAdmin) {
      return res.status(403).json({ error: "Super admin already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save super admin to the database
    const newSuperAdmin = new Admin({
      email,
      username,
      password: hashedPassword,
      role: "superAdmin",
    });
    await newSuperAdmin.save();

    res.status(201).json({ message: "Super admin created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminExists = await Admin.findOne({ email });

    if (!adminExists) {
      return res.status(404).json({ message: "Email does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      adminExists.password
    );

    if (!isPasswordValid)
      return res.status(401).json({ message: "Password does not match" });

    const token = generateToken(adminExists);

    res.status(200).json({
      username: adminExists.username,
      email: adminExists.email,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Error logging in :" + err.message });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (req.admin.role !== "superAdmin") {
      return res.status(403).json({ error: "Permission denied" });
    }

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      res.status(400).json({ error: "Admin or Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      email,
      username,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error creating admin " + err.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    if (req.admin.role !== "superAdmin") {
      return res.status(403).json({ error: "Permission denied" });
    }

    const { id } = req.params;

    const adminExists = await Admin.findById(id);

    if (!adminExists) return res.status(400).json({ error: "Admin not found" });

    await Admin.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: `Admin ${adminExists.username} deleted successfully` });
  } catch (err) {
    res.status(500).json({ error: "Error deleting admin ERR:" + err.message });
  }
};
