import Department from "../models/Department.js";
import Faculty from "../models/Faculty.js";
import { deleteFromCloudinary } from "../utilities/deleteCloudFiles.js";
import {
  getBodyWithFiles,
  deleteCloudFiles,
  getUpdatedBodyWithFiles,
} from "../utilities/helpers.js";

// 🆕 CREATE FACULTY
export const addFaculty = async (req, res) => {
  const { deptID } = req.params; // Extract department ID

  if (
    !req.body.name ||
    !req.body.designation ||
    !req.body.education ||
    !req.body.shift
  ) {
    return res
      .status(400)
      .json({ error: "One or more required fields are missing or invalid." });
  }

  try {
    // Check if the department exists
    const department = await Department.findById(deptID);
    if (!department)
      return res.status(404).json({ error: "Department not found" });

    const data = await getBodyWithFiles(req);

    const newFaculty = new Faculty({ ...data, deptID });

    await newFaculty.save();

    res.status(201).json({
      message: "Faculty added successfully!",
      data: newFaculty,
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding faculty: " + error.message });
  }
};

export const updateFaculty = async (req, res) => {
  const { facultyID } = req.params; // Extract faculty ID

  try {
    const faculty = await Faculty.findById(facultyID);
    if (!faculty) return res.status(404).json({ error: "Faculty not found" });

    // Process updated files and delete old ones from Cloudinary
    const updatedData = await getUpdatedBodyWithFiles(req, faculty);

    // Update faculty record
    const updatedFaculty = await Faculty.findByIdAndUpdate(
      facultyID,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Faculty updated successfully",
      data: updatedFaculty,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating faculty: " + error.message });
  }
};

// ❌ DELETE FACULTY
export const deleteFaculty = async (req, res) => {
  const { facultyID } = req.params;

  try {
    const faculty = await Faculty.findById(facultyID);
    if (!faculty) return res.status(404).json({ error: "Faculty not found" });

    // Delete Cloudinary files
    let fieldNames = ["imgSrc", "pdfSrc"];
    await deleteCloudFiles(fieldNames, faculty);

    // Remove faculty from DB
    await Faculty.findByIdAndDelete(facultyID);

    res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting faculty: " + error.message });
  }
};
