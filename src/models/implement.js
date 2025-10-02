import mongoose from "mongoose";
const { Schema } = mongoose;

const ImplementSchema = new Schema(
  {
    implementID: { type: String, required: true, unique: true }, // PK
    name: { type: String, required: true },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Implement", ImplementSchema,"implement");
