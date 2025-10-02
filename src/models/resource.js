import mongoose from "mongoose";

const { Schema } = mongoose;

const resourceSchema = new Schema(
  {
    // Primary Key: Mongoose automatically creates _id, we can alias it to resourceID
    _id: { type: Schema.Types.ObjectId, auto: true, alias: "resourceID" },

    unit: {
      type: Schema.Types.ObjectId,
      ref: "Unit",
      required: false, // nullable
    },
    
    name: {
      type: String,
      maxlength: 255,
      trim: true,
      default: null,
    },
    notes: {
      type: String,
      maxlength: 500,
      trim: true,
      default: null,
    },
    category: {
      type: String,
      maxlength: 500,
      trim: true,
      default: null,
    },
    unitPrice: {
      type: Number,
      default: null,
    },
    
  
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: true, // we handle created_at manually
  }
);

export default mongoose.model("Resource", resourceSchema,"resource");
