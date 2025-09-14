import mongoose from "mongoose";

const { Schema } = mongoose;

const resourceSchema = new Schema(
  {
    // Primary Key: Mongoose automatically creates _id, we can alias it to resourceID
    _id: { type: Schema.Types.ObjectId, auto: true, alias: "resourceID" },

    unitID: {
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
    unit_Price: {
      type: Number,
      default: null,
    },
    
    created_at: {
      type: Date,
      default: Date.now,
    },
    created_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updated_at: { type: Date, default: null },
    updated_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: false, // we handle created_at manually
  }
);

export default mongoose.model("Resource", resourceSchema,"resource");
