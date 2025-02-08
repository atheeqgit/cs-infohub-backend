import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProgramSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  programType: {
    type: String,
    enum: ["under Graduate", "post Graduate", "phd", "mphil", "other"],
    required: true,
  },
  aboutProgram: [{ type: String, required: true }],
  deptID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "department",
  },
});

export default mongoose.model("Program", ProgramSchema);
