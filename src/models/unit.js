import mongoose from "mongoose";
const { Schema } = mongoose;

const unitSchema = new Schema({
     name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    symbol: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User", // assuming you have a User model
      required: true,
    },
    updated_at: {
      type: Date,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
});

export default mongoose.model("Unit", unitSchema, "unit");
