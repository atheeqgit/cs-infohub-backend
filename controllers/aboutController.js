import Department from "../models/Department.js";

export const updateAbout = async (req, res) => {
  const { pathName } = req.params; // Identify the department
  const updatedAbout = req.body.data; // Updated about data from request body

  if (updatedAbout.length < 1) {
    return res
      .status(404)
      .json({ error: "Department must contain an about section" });
  }

  try {
    const department = await Department.findOne({ pathName });
    // const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    department.about = updatedAbout; // Update the about
    await department.save();

    res.status(200).json({
      message: "About updated successfully",
      data: department.about,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
