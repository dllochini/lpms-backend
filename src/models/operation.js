import mongoose from "mongoose";
const { Schema } = mongoose;

const OperationSchema = new Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Operation", OperationSchema, "operation");
