import mongoose from "mongoose";
const { Schema } = mongoose;

const ImplementSchema = new Schema(
  {
    //implementID: { type: String, required: true, unique: true }, // PK
    name: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    created_by: { type: String },
    updated_at: { type: Date },
    updated_by: { type: String },
  },
  
);

export default mongoose.model("Implement", ImplementSchema,"implement");
