import mongoose from "mongoose";
import { SrcSchema } from "./srcSchema.js";

const Schema = mongoose.Schema;

const EventSchema = new Schema({
  eventTitle: { type: String, required: true },
  date: { type: String, required: true },
  eventType: {
    type: String,
    enum: ["Seminars", "Culturals", "Events", "other"],
    required: true,
  },
  aboutEvent: { type: String, required: true, maxLength: 500 },
  imgSrc: SrcSchema,
  imgType: { type: String, enum: ["Portrait", "Landscape"], required: true },
  showOnHome: { type: Boolean, default: false },
  deptID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "department",
  },
});

export default mongoose.model("Event", EventSchema);
