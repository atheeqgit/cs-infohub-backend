import mongoose from "mongoose";

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: { type: String, enum: ["superAdmin", "admin"], default: "admin" },
  faculty: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Admin", adminSchema);
