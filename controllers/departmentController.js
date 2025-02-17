import Department from "../models/Department.js";
import {
  getBodyWithFiles,
  getUpdatedBodyWithFiles,
  deleteCloudFiles,
  deleteUploadsIfFailed,
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

  const typeArray = [
    "programsData",
    "facultyData",
    "eventsData",
    "infrastructureData",
    "careerData",
  ];
  if (!typeArray.includes(type)) {
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
      data[type] = await Program.find({ deptID });
    }
    if (type == "facultyData") {
      data[type] = await Faculty.find({ deptID });
    }
    if (type == "eventsData") {
      data[type] = await Event.find({ deptID });
    }
    if (type == "infrastructureData") {
      data[type] = await Infrastructure.find({ deptID });
    }
    if (type == "careerData") {
      data[type] = await Career.find({ deptID });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error Getting All data: " + err.message });
  }
};

export const createDepartment = async (req, res) => {
  console.log("Before try block");
  try {
    console.log("Entering try block");

    const { pathName, deptName, snippetData, about } = req.body;

    if (!pathName || !deptName || !snippetData || !about || !about.length) {
      throw new Error("One or more required fields are missing or invalid.");
    }
    // Validate path first
    const pathExists = await Department.findOne({ pathName });
    if (pathExists) {
      throw new Error("Path name already exists!");
    }

    // Validate department name
    const deptExists = await Department.findOne({ deptName });
    if (deptExists) {
      throw new Error("Department already exists!");
    }

    const data = getBodyWithFiles(req);
    const snippData =
      typeof data.snippetData === "string"
        ? JSON.parse(data.snippetData)
        : data.snippetData;

    const abt = !Array.isArray(data.about)
      ? JSON.parse(data.about)
      : data.about;
    // Create new department
    const newDept = new Department({
      ...data,
      snippetData: snippData,
      about: abt,
    });
    await newDept.save();

    return res.status(201).json({
      message: "Department home content created successfully!",
      data: newDept,
    });
  } catch (err) {
    console.log("Inside catch block", err);
    await deleteUploadsIfFailed(req);
    res.status(500).json({
      error: "An error creating department:" + err.message,
    });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { pathName } = req.params; // Extract pathName from URL

    // Check if the department exists
    const deptExists = await Department.findOne({ pathName });

    if (!deptExists) {
      throw new Error("Department not found");
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
    await deleteUploadsIfFailed(req);
    res
      .status(500)
      .json({ error: "catch - Error updating department: " + err.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params; // Department ID

    const deptExists = await Department.findById(id);
    if (!deptExists) {
      return res.status(400).json({ error: "Department not found" });
    }

    // Delete Department-specific Cloudinary files
    let deptFields = ["deptIcon", "facultyBG", "eventsBG", "aboutBG"];
    await deleteCloudFiles(deptFields, deptExists);

    // Fetch all related documents
    const [faculties, events, infrastructures, careers] = await Promise.all([
      Faculty.find({ deptID: id }),
      Event.find({ deptID: id }),
      Infrastructure.find({ deptID: id }),
      Career.find({ deptID: id }),
    ]);

    // Function to extract and delete images
    const deleteRelatedImages = async (items, fields) => {
      for (const item of items) {
        console.log(item, fields);
        await deleteCloudFiles(fields, item);
      }
    };

    // Delete images from Cloudinary
    await Promise.all([
      deleteRelatedImages(faculties, ["imgSrc", "pdfSrc"]),
      deleteRelatedImages(events, ["imgSrc"]),
      deleteRelatedImages(infrastructures, ["imgSrc"]),
      deleteRelatedImages(careers, ["imgSrc"]),
    ]);

    // Delete all related records
    await Promise.all([
      Faculty.deleteMany({ deptID: id }),
      Event.deleteMany({ deptID: id }),
      Program.deleteMany({ deptID: id }),
      Infrastructure.deleteMany({ deptID: id }),
      Career.deleteMany({ deptID: id }),
    ]);

    // Delete the department
    await Department.findByIdAndDelete(id);

    res.status(200).json({
      message: `Department ${deptExists.deptName} deleted successfully`,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error deleting department: " + err.message });
  }
};
