import mongoose from "mongoose";
const { Schema } = mongoose;

const landSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

    
    unit: { type: Schema.Types.ObjectId, ref: "Unit" },
    size: { type: Number, required: true },
    location: { type: String },

    division: { type: Schema.Types.ObjectId, ref: "Division", required: true }, // divisionID (FK)

    area: { type: Number }, // integer(10)

    images: [{ type: Schema.Types.Mixed }], // could be array of file refs/URLs or objects
    documents: [{ type: Schema.Types.Mixed }], // same as images

    signed_agreement: { type: Schema.Types.Mixed }, // boolean, file ref, or object

    created_at: { type: Date, default: Date.now },
    created_by: { type: Schema.Types.ObjectId, ref: "User" },
    updated_at: { type: Date, default: Date.now },
    updated_by: { type: Schema.Types.ObjectId, ref: "User" },
     status: { type: String, enum: ["active", "inactive"], default: "active" },
    notes: { type: String },
    updated_history: [
      {
        updated_at: { type: Date, default: Date.now },
        updated_by: { type: Schema.Types.ObjectId, ref: "User" },
        changes: { type: Schema.Types.Mixed }, // optional: track what changed
      },
    ],
  },
  { timestamps: true } // ✅ auto-generates createdAt & updatedAt
);

export default mongoose.model("Land", landSchema, "land");
