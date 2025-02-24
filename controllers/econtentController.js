import { globalAgent } from "http";
import {
  deleteUploadsIfFailed,
  deleteCloudFiles,
} from "../utilities/helpers.js";
import { deleteFromCloudinary } from "../utilities/deleteCloudFiles.js";
import Program from "../models/Program.js";
import Econtent from "../models/Econtent.js";

export const getAllPrograms = async (req, res) => {
  const { deptID } = req.params;
  try {
    const programs = await Program.find({ deptID }); // ✅ Correct method

    res.status(200).json({
      success: true,
      data: programs,
    });
  } catch (err) {
    res.status(500).json({ error: "Error Getting Programs: " + err.message });
  }
};

// export const getNumberOfEcontents = async (req, res) => {
//   const { progID } = req.params;
//   try {
//     const totEcontents = await Econtent.countDocuments({ programId: progID });

//     res.status(200).json({
//       success: true,
//       data: totEcontents,
//     });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Error fetching total E-Contents: " + err.message });
//   }
// };
export const getAllEcontentsBySearch = async (req, res) => {
  try {
    const { query, filter, pageNumber, limit } = req.query;

    if (!query || !filter) {
      return res.status(400).json({ error: "Query and filter are required" });
    }

    const pageNum = pageNumber ? parseInt(pageNumber) : 1;
    const pagination = limit ? parseInt(limit) : 10; // Default limit is 2

    const filters = {
      title: { title: query },
      subjectCode: { subjectCode: query },
      subjectName: { subjectName: query },
      programName: { programName: query },
    };

    if (!filters[filter]) {
      return res.status(400).json({ error: "Invalid filter type" });
    }

    const totalEcontents = await Econtent.countDocuments(filters[filter]);

    const econtents = await Econtent.find(filters[filter])
      .sort({ title: 1 }) // A-Z
      .skip((pageNum - 1) * pagination)
      .limit(pagination);

    res.status(200).json({
      success: true,
      data: econtents,
      totalContents: totalEcontents,
      currentPage: pageNum,
      totalPages: Math.ceil(totalEcontents / pagination),
    });
  } catch (err) {
    res.status(500).json({ error: "Error Getting E-Contents: " + err.message });
  }
};

export const getAllEcontentsBySem = async (req, res) => {
  const { progID, sem } = req.params;

  try {
    const semesterNumber = parseInt(sem); // Convert sem to a number

    if (isNaN(semesterNumber)) {
      return res.status(400).json({ error: "Invalid semester value" });
    }

    const econtents = await Econtent.find({
      programId: progID,
      semester: sem,
    }).sort();
    res.status(200).json({
      success: true,
      data: econtents,
    });
  } catch (err) {
    res.status(500).json({ error: "Error Getting E-Contents: " + err.message });
  }
};

export const addEcontent = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = [
      "title",
      "subjectName",
      "subjectCode",
      "programName",
      "type",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(",")}`);
    }
    // Process file uploads
    const data = await getBodyWithFilesArray(req);

    // Create new e-content entry
    const newEcontent = new Econtent(data);

    await newEcontent.save();

    res.status(201).json({
      message: "E-content added successfully!",
      data: newEcontent,
    });
  } catch (error) {
    await deleteUploadsIfFailed(req);
    res.status(500).json({ error: "Error adding e-content: " + error.message });
  }
};

// 🔄 UPDATE E-CONTENT
export const updateEcontent = async (req, res) => {
  const { id } = req.params;

  try {
    const econtent = await Econtent.findById(id);
    if (!econtent) throw new Error("E-content not found");

    // Process file updates and maintain existing files
    const updatedData = await getUpdatedBodyWithFilesArray(req, econtent);

    // Update e-content record
    const updatedEcontent = await Econtent.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "E-content updated successfully",
      data: updatedEcontent,
    });
  } catch (error) {
    await deleteUploadsIfFailed(req);
    res
      .status(500)
      .json({ error: "Error updating e-content: " + error.message });
  }
};

// ❌ DELETE E-CONTENT
export const deleteEcontent = async (req, res) => {
  const { id } = req.params;

  try {
    const econtent = await Econtent.findById(id);
    if (!econtent) throw new Error("E-content not found");

    // Delete all associated files from Cloudinary
    if (econtent.files.length > 0) {
      for (const file of econtent.files) {
        await deleteFromCloudinary(file.public_id);
      }
    }

    // Remove from DB
    await Econtent.findByIdAndDelete(id);

    res.status(200).json({ message: "E-content deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting e-content: " + error.message });
  }
};

// HELPER FUNCTIONS MODIFIED FOR ONLY E_CONTENT

const getBodyWithFilesArray = (req) => {
  const cloudFilesLinks = req.cloudinaryFiles || [];
  let uploadedFiles = [];

  if (cloudFilesLinks?.length > 0) {
    cloudFilesLinks.forEach((fileData) => {
      uploadedFiles.push({
        url: fileData.url,
        public_id: fileData.public_id,
      });
    });
  }

  return { ...req.body, files: uploadedFiles };
};

const getUpdatedBodyWithFilesArray = async (req, existedData) => {
  let body = { ...req.body }; // Copy request body
  const cloudFilesLinks = req.cloudinaryFiles || [];
  let uploadedFiles = [];

  if (cloudFilesLinks.length > 0) {
    if (existedData?.files) {
      for (const oldFile of existedData.files) {
        await deleteFromCloudinary(oldFile.public_id);
      }
    }

    cloudFilesLinks.forEach((fileData) => {
      uploadedFiles.push({
        url: fileData.url,
        public_id: fileData.public_id,
      });
    });

    body = { ...req.body, files: uploadedFiles };
  }

  return body;
};
