import mongoose from "mongoose";
import { SrcSchema } from "./srcSchema.js";

const Schema = mongoose.Schema;

const DepartmentSchema = new Schema(
  {
    pathName: {
      type: String,
      unique: true,
      required: true,
      match: /^[a-z0-9-]+$/, // URL-friendly format (e.g., "computer-science")
      trim: true,
    },
    deptIcon: SrcSchema,
    deptName: { type: String, required: true }, // Display name (e.g., "Computer Science")
    bannerData: [SrcSchema], // Banner images
    snippetData: {
      studentsCount: { type: Number, default: 0 },
      staffsCount: { type: Number, default: 0 },
      alumniCount: { type: Number, default: 0 },
    },
    about: [{ type: String }], // About section paragraphs
    facultyBG: SrcSchema, // Background image for programmes section
    facultyData: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
      },
    ], // Faculty details
    eventsBG: SrcSchema, // Background image for programmes section
    eventsData: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Events",
      },
    ], // List of Events
    programmeBG: SrcSchema, // Background image for programmes section
    programsData: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Programs",
      },
    ], // List of programs
    infrastructureData: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Infras",
      },
    ], // Labs and facilities
    careerData: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Careers",
      },
    ], // Labs and facilities
  },
  { timestamps: true }
);

// Indexes for fast querying
//DepartmentSchema.index({ pathName: 1 }); // Speeds up route-based queries

export default mongoose.model("Department", DepartmentSchema);
