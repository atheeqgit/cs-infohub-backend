import Department from "../models/Department.js";
import Program from "../models/Program.js";
// import {
//   getBodyWithFiles,
//   deleteCloudFiles,
//   getUpdatedBodyWithFiles,
// } from "../utilities/helpers.js";

// 🆕 CREATE PROGRAM
export const addProgram = async (req, res) => {
  const { deptID } = req.params; // Extract department ID

  if (!req.body.title || !req.body.programType || !req.body.aboutProgram) {
    return res
      .status(400)
      .json({ error: "Required fields are missing or invalid." });
  }
  try {
    // const aboutProgram = !Array.isArray(req.body.aboutProgram)
    //   ? JSON.parse(req.body.aboutProgram)
    //   : req.body.aboutProgram;

    // Check if the department exists
    const department = await Department.findById(deptID);
    if (!department)
      return res.status(404).json({ error: "Department not found" });

    const newProgram = new Program({ ...req.body, deptID });

    await newProgram.save();

    res.status(201).json({
      message: "Program added successfully!",
      data: newProgram,
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding program: " + error.message });
  }
};

export const updateProgram = async (req, res) => {
  const { id } = req.params; // Extract program ID

  try {
    const program = await Program.findById(id);
    if (!program) return res.status(404).json({ error: "Program not found" });

    const updatedData = req.body;

    // Update program record
    const updatedProgram = await Program.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Program updated successfully",
      data: updatedProgram,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating program: " + error.message });
  }
};

// ❌ DELETE PROGRAM
export const deleteProgram = async (req, res) => {
  const { id } = req.params;

  try {
    const program = await Program.findById(id);
    if (!program) return res.status(404).json({ error: "Program not found" });

    // Remove program from DB
    await Program.findByIdAndDelete(id);

    res.status(200).json({ message: "Program deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting program: " + error.message });
  }
};
