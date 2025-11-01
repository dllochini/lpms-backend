import mongoose from "mongoose";
const { Schema } = mongoose;

const counterSchema = new Schema({
  _id: { type: String, required: true }, // counter name, e.g., "userId"
  seq: { type: Number, default: 0 },
});

export const Counter = mongoose.model("Counter", counterSchema);
