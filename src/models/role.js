import mongoose from "mongoose";
const { Schema } = mongoose;

const roleSchema = new Schema(
  {
    role: { type: Schema.Types.ObjectId, auto: true }, // PK
    name: { type: String, required: true },
  },
);

export default mongoose.model("Role", roleSchema, "role");
