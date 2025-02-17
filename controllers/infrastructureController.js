import Department from "../models/Department.js";
import Infrastructure from "../models/Infrastructure.js";
import {
  getBodyWithFiles,
  deleteCloudFiles,
  getUpdatedBodyWithFiles,
  deleteUploadsIfFailed,
} from "../utilities/helpers.js";

// 🆕 CREATE INFRASTRUCTURE
export const addInfrastructure = async (req, res) => {
  const { deptID } = req.params; // Extract department ID

  if (!req.body.name || !req.body.about || !req.body.code) {
    throw new Error("Required fields are missing or invalid.");
  }
  try {
    // Check if the department exists
    const department = await Department.findById(deptID);
    if (!department) throw new Error("Department not found");

    const data = await getBodyWithFiles(req);

    const newInfrastructure = new Infrastructure({ ...data, deptID });

    await newInfrastructure.save();

    res.status(201).json({
      message: "Infrastructure added successfully!",
      data: newInfrastructure,
    });
  } catch (error) {
    await deleteUploadsIfFailed(req);
    res
      .status(500)
      .json({ error: "Error adding infrastructure: " + error.message });
  }
};

export const updateInfrastructure = async (req, res) => {
  const { id } = req.params; // Extract infrastructure ID

  try {
    const infrastructure = await Infrastructure.findById(id);
    if (!infrastructure) throw new Error("Infrastructure not found");

    // Process updated files and delete old ones from Cloudinary
    const updatedData = await getUpdatedBodyWithFiles(req, infrastructure);

    // Update infrastructure record
    const updatedInfrastructure = await Infrastructure.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Infrastructure updated successfully",
      data: updatedInfrastructure,
    });
  } catch (error) {
    await deleteUploadsIfFailed(req);
    res
      .status(500)
      .json({ error: "Error updating infrastructure: " + error.message });
  }
};

// ❌ DELETE INFRASTRUCTURE
export const deleteInfrastructure = async (req, res) => {
  const { id } = req.params;

  try {
    const infrastructure = await Infrastructure.findById(id);
    if (!infrastructure) throw new Error("Infrastructure not found");

    // Delete Cloudinary files
    let fieldNames = ["imgSrc"];
    await deleteCloudFiles(fieldNames, infrastructure);

    // Remove infrastructure from DB
    await Infrastructure.findByIdAndDelete(id);

    res.status(200).json({ message: "Infrastructure deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting infrastructure: " + error.message });
  }
};
