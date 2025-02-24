import mongoose from "mongoose";
import { SrcSchema } from "./srcSchema.js";

const Schema = mongoose.Schema;

const eContentSchema = new Schema({
  title: {
    type: String,
    required: true,
    index: true,
  },
  subjectName: {
    type: String,
    required: true,
    index: true,
  },
  subjectCode: {
    type: String,
    required: true,
    index: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  programName: {
    type: String,
    required: true,
    index: true,
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
  },
  type: {
    type: String,
    required: true,
    index: true,
  },
  files: [SrcSchema],
  uploadedBy: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  tags: [
    {
      type: String,
      index: true,
    },
  ],
  metadata: {
    academicYear: String,
    author: String,
    institution: String,
  },
});

eContentSchema.index({
  title: "text",
  subjectName: "text",
  subjectCode: "text",
  programName: "text",
  tags: "text",
});
export default mongoose.model("EContent", eContentSchema);
