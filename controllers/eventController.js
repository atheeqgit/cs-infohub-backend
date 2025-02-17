import Department from "../models/Department.js";
import Event from "../models/Event.js";
import {
  getBodyWithFiles,
  deleteCloudFiles,
  getUpdatedBodyWithFiles,
  deleteUploadsIfFailed,
} from "../utilities/helpers.js";

// 🆕 CREATE EVENT
export const addEvent = async (req, res) => {
  try {
    const { deptID } = req.params; // Extract department ID
    if (
      !req.body.eventTitle ||
      !req.body.date ||
      !req.body.eventType ||
      !req.body.aboutEvent
    ) {
      throw new Error("Required fields are missing");
    }
    // Check if the department exists
    const department = await Department.findById(deptID);
    if (!department) throw new Error("Department not found");

    const data = await getBodyWithFiles(req);

    const newEvent = new Event({ ...data, deptID });

    await newEvent.save();

    res.status(201).json({
      message: "Event added successfully!",
      data: newEvent,
    });
  } catch (error) {
    await deleteUploadsIfFailed(req);
    res.status(500).json({ error: "Error adding event: " + error.message });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params; // Extract event ID

  try {
    const event = await Event.findById(id);
    if (!event) throw new Error("Event not found");

    // Process updated files and delete old ones from Cloudinary
    const updatedData = await getUpdatedBodyWithFiles(req, event);

    // Update event record
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    await deleteUploadsIfFailed(req);
    res.status(500).json({ error: "Error updating event: " + error.message });
  }
};

// ❌ DELETE EVENT
export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);
    if (!event) throw new Error("Event not found");

    // Delete Cloudinary files
    let fieldNames = ["imgSrc"];
    await deleteCloudFiles(fieldNames, event);

    // Remove event from DB
    await Event.findByIdAndDelete(id);

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting event: " + error.message });
  }
};
