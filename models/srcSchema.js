import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const SrcSchema = new Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
});
