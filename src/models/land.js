import mongoose from "mongoose";
const { Schema } = mongoose;

const landSchema = new Schema(
  {
    landId: { type: String, required: true, unique: true },
    farmer: { type: Schema.Types.ObjectId, ref: "User", required: true },

    size: { type: Number, required: true },
    sizeUnitID: { type: Schema.Types.ObjectId, ref: "Unit" },

    location: { type: String },
    // addressLine1: { type: String },
    // addressLine2: { type: String },
    // city: { type: String },
    // district: { type: String },

    status: { type: String, enum: ["active", "inactive"], default: "active" },
    notes: { type: String },
  },
  { timestamps: true } // ✅ will auto-generate createdAt & updatedAt
);

export default mongoose.model("Land", landSchema, "land");
