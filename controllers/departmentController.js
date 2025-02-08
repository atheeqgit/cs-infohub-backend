import Department from "../models/Department.js";
import {
  getBodyWithFiles,
  getUpdatedBodyWithFiles,
  deleteCloudFiles,
} from "../utilities/helpers.js";

import Faculty from "../models/Faculty.js";
import Career from "../models/Career.js";
import Event from "../models/Event.js";
import Infrastructure from "../models/Infrastructure.js";
import Program from "../models/Program.js";

export const getDepartment = async (req, res) => {
  try {
    const { pathName } = req.params;

    const department = await Department.findOne({ pathName });

    if (!department) {
      return res.status(400).json({ error: "Department not found" });
    }

    const [
      ProgramsData,
      facultyData,
      eventsData,
      infrastructureData,
      careerData,
    ] = await Promise.all([
      Program.find({ deptID: department._id }),
      Faculty.find({ deptID: department._id, showOnHome: true }),
      Event.find({ deptID: department._id, showOnHome: true }),
      Infrastructure.find({ deptID: department._id }),
      Career.find({ deptID: department._id }),
    ]);

    res.status(200).json({
      data: {
        department,
        ProgramsData,
        facultyData,
        eventsData,
        infrastructureData,
        careerData,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Error Getting Department: " + err.message });
  }
};

export const getAllData = async (req, res) => {
  const { deptID, type } = req.params;
  if (
    type !== "ProgramsData" ||
    type !== "facultyData" ||
    type !== "eventsData" ||
    type !== "infrastructureData" ||
    type !== "careerData"
  ) {
    return res.status(400).json({
      error: "the Type pram is invalid",
    });
  }
  let data = {};
  try {
    const department = await Department.findById(deptID);

    if (!department) {
      return res.status(400).json({ error: "Department not found" });
    }

    if (type == "programsData") {
      data[type] = await Program.find({ deptID: department._id });
    }
    if (type == "facultyData") {
      data[type] = await Faculty.find({ deptID: department._id });
    }
    if (type == "eventsData") {
      data[type] = await Event.find({ deptID: department._id });
    }
    if (type == "infrastructureData") {
      data[type] = await Infrastructure.find({ deptID: department._id });
    }
    if (type == "careerData") {
      data[type] = await Career.find({ deptID: department._id });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error Getting All data: " + err.message });
  }
};
export const createDepartment = async (req, res) => {
  const { pathName, deptName, snippetData, about } = req.body;

  console.log(req.body);

  if (
    !pathName ||
    !deptName ||
    !snippetData ||
    // snippetData?.studentsCount === undefined ||
    // snippetData?.staffsCount === undefined ||
    // snippetData?.alumniCount === undefined ||
    !about ||
    !about.length
  ) {
    return res.status(400).json({
      error: "One or more required fields are missing or invalid.",
    });
  }

  try {
    // Validate path first
    const pathExists = await Department.findOne({ pathName });
    if (pathExists) {
      return res.status(400).json({ error: "Path name already exists!" });
    }

    // Validate department name
    const deptExists = await Department.findOne({ deptName });
    if (deptExists) {
      return res.status(400).json({ error: "Department already exists!" });
    }

    const data = getBodyWithFiles(req);
    const snippetData =
      typeof data.snippetData === "string"
        ? JSON.parse(data.snippetData)
        : data.snippetData;

    const about = !Array.isArray(data.about)
      ? JSON.parse(data.about)
      : data.about;
    // Create new department
    const newDept = new Department({ ...data, snippetData, about });
    await newDept.save();

    return res.status(201).json({
      message: "Department home content created successfully!",
      data: newDept,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error:
        "An error occurred while creating department home content: " +
        err.message,
    });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { pathName } = req.params; // Extract pathName from URL

    // Check if the department exists
    const deptExists = await Department.findOne({ pathName });

    if (!deptExists) {
      return res.status(404).json({ error: "Department not found" });
    }

    const updateData = await getUpdatedBodyWithFiles(req, deptExists);
    // Update the department content
    const updatedDept = await Department.findOneAndUpdate(
      { pathName },
      { $set: updateData }, // Apply the updates
      { new: true, runValidators: true } // Return the updated document and validate
    );

    res.status(200).json({
      message: "Department content updated successfully",
      data: updatedDept,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "catch - Error updating department: " + err.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params; // Extract pathName from URL

    const deptExists = await Department.findById(id);

    if (!deptExists)
      return res.status(400).json({ error: "Department not found" });

    let fieldNames = ["deptIcon", "facultyBG", "eventsBG", "programmeBG"];
    await deleteCloudFiles(fieldNames, deptExists);

    await Department.findByIdAndDelete(id);

    res.status(200).json({
      message: `Department ${deptExists.deptName} deleted successfully`,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "catch - Error Deleting department: " + err.message });
  }
};
