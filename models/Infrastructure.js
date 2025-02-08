import mongoose from "mongoose";
import { SrcSchema } from "./srcSchema.js";

const Schema = mongoose.Schema;

const InfrastructureSchema = new Schema({
  imgSrc: SrcSchema,
  code: { type: String, maxLength: 15 },
  name: { type: String, required: true, maxLength: 50 },
  about: [{ type: String, maxLength: 220 }],
  deptID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "department",
  },
});

export default mongoose.model("Infrastructure", InfrastructureSchema);
