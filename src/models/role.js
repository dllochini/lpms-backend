import mongoose from "mongoose";
const { Schema } = mongoose;

const roleSchema = new Schema(
  {
    role: { type: Schema.Types.ObjectId, auto: true }, // PK
    name: { type: String, required: true },

    created_at: { type: Date, default: Date.now },
    created_by: { type: Schema.Types.ObjectId }, // not FK, just stored ID

    updated_at: { type: Date, default: Date.now },
    updated_by: { type: Schema.Types.ObjectId }, // not FK, just stored ID
  },
  { timestamps: false } // using our own audit fields
);

export default mongoose.model("Role", roleSchema, "role");
