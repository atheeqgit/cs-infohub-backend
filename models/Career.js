import mongoose from "mongoose";
import { SrcSchema } from "./srcSchema.js";

const Schema = mongoose.Schema;

const CareerSchema = new Schema({
  imgSrc: SrcSchema,
  careerTitle: { type: String, required: true, maxLength: 50 },
  deptID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "department",
  },
});

export default mongoose.model("Career", CareerSchema);
