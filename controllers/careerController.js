import Department from "../models/Department.js";
import Career from "../models/Career.js";
import {
  getBodyWithFiles,
  deleteCloudFiles,
  getUpdatedBodyWithFiles,
} from "../utilities/helpers.js";

// 🆕 CREATE CAREER
export const addCareer = async (req, res) => {
  const { deptID } = req.params; // Extract department ID

  if (!req.body.careerTitle) {
    return res
      .status(400)
      .json({ error: "Required fields are missing or invalid." });
  }
  try {
    // Check if the department exists
    const department = await Department.findById(deptID);
    if (!department)
      return res.status(404).json({ error: "Department not found" });

    const data = await getBodyWithFiles(req);

    const newCareer = new Career({ ...data, deptID });

    await newCareer.save();

    res.status(201).json({
      message: "Career added successfully!",
      data: newCareer,
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding career: " + error.message });
  }
};

export const updateCareer = async (req, res) => {
  const { id } = req.params; // Extract career ID

  try {
    const career = await Career.findById(id);
    if (!career) return res.status(404).json({ error: "Career not found" });

    // Process updated files and delete old ones from Cloudinary
    const updatedData = await getUpdatedBodyWithFiles(req, career);

    // Update career record
    const updatedCareer = await Career.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Career updated successfully",
      data: updatedCareer,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating career: " + error.message });
  }
};

// ❌ DELETE CAREER
export const deleteCareer = async (req, res) => {
  const { id } = req.params;

  try {
    const career = await Career.findById(id);
    if (!career) return res.status(404).json({ error: "Career not found" });

    // Delete Cloudinary files
    let fieldNames = ["imgSrc"];
    await deleteCloudFiles(fieldNames, career);

    // Remove career from DB
    await Career.findByIdAndDelete(id);

    res.status(200).json({ message: "Career deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting career: " + error.message });
  }
};
