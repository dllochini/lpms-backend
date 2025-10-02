import mongoose from "mongoose";
const { Schema } = mongoose;

const OperationSchema = new Schema(
  {
    _id: { type: String, unique: true },
    //operationID: { type: String, required: true, unique: true }, // PK
    name: { type: String, required: true },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Operation", OperationSchema,"operation");
