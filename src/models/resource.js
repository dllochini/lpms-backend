import mongoose from "mongoose";

const { Schema } = mongoose;

const  resourceSchema = new Schema(
  {
    // _id: String,
    unit: {
    type: Schema.Types.ObjectId,
    ref: "Unit",
    required: true,
  },
    resource_Name: { type: String, required: true, trim: true },
    description: { type: String, maxlength: 500, trim: true }
        
  });

export default mongoose.model("Resource",  resourceSchema,"resource");