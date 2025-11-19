import mongoose from "mongoose";

const { Schema } = mongoose;

const divisionSchema = new Schema(
  {
    name: {
      type: String,
      maxlength: 255,
      trim: true,
      default: null, // Nullable
    },
  },
  { timestamps: true }
);

export default mongoose.model("Division", divisionSchema, "division");
