import mongoose from "mongoose";
const { Schema } = mongoose;

const roleSchema = new Schema({
  // _id: String,
  role: String,
});

export default mongoose.model("Role", roleSchema, "role");
