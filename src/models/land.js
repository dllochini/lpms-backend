import mongoose from "mongoose";
const { Schema } = mongoose;

const landSchema = new Schema(
  {
    farmer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    division: { type: Schema.Types.ObjectId, ref: "Division", required: true },
    unit: { type: Schema.Types.ObjectId, ref: "Unit" },
    size: { type: String, required: true },
    address: { type: String },
    images: [{ type: Schema.Types.Mixed }],
    documents: [{ type: Schema.Types.Mixed }],
    signedAgreement: { type: Schema.Types.Mixed },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },
    updatedHistory: [
      {
        updatedAt: { type: Date, default: Date.now },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
        changes: { type: Schema.Types.Mixed },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Land", landSchema, "land");
