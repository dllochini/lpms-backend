import mongoose from "mongoose";
const { Schema } = mongoose;

const landSchema = new Schema(
  {
    _id: { type: String, unique: true },
    farmer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    division: { type: Schema.Types.ObjectId, ref: "Division", required: true }, // divisionID (FK)
    unit: { type: Schema.Types.ObjectId, ref: "Unit" },
    size: { type: String, required: true },
    address: { type: String },
    images: [{ type: Schema.Types.Mixed }], // could be array of file refs/URLs or objects
    documents: [{ type: Schema.Types.Mixed }], // same as images
    signedAgreement: { type: Schema.Types.Mixed }, // boolean, file ref, or object
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },
    updatedHistory: [
      {
        updatedAt: { type: Date, default: Date.now },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
        changes: { type: Schema.Types.Mixed }, // optional: track what changed
      },
    ],
  },
  { timestamps: true } // ✅ auto-generates createdAt & updatedAt
);

export default mongoose.model("Land", landSchema, "land");