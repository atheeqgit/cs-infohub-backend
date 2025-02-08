import mongoose from "mongoose";
import { SrcSchema } from "./srcSchema.js";

const Schema = mongoose.Schema;

const FacultySchema = new Schema({
  imgSrc: SrcSchema,
  name: { type: String, required: true },
  designation: { type: String, required: true },
  education: { type: String, required: true },
  pdfSrc: SrcSchema,
  shift: { type: String, required: true, enum: ["shift1", "shift2", "both"] },
  showOnHome: { type: Boolean, default: false },
  deptID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "department",
  },
});

export default mongoose.model("Faculty", FacultySchema);
