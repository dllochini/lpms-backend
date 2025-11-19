import mongoose from "mongoose";

const { Schema } = mongoose;

const resourceSchema = new Schema(
  {
    unit: { type: Schema.Types.ObjectId, ref: "Unit" },
    name: { type: String, maxlength: 255, trim: true, default: null },
    notes: { type: String, maxlength: 500, trim: true, default: null },
    category: { type: String, maxlength: 500, trim: true, default: null },
    unitPrice: { type: Number, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Resource", resourceSchema, "resources");
