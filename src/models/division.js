import mongoose from "mongoose";

const { Schema } = mongoose;

const divisionSchema = new Schema(
  {
   // _id: { type: Schema.Types.ObjectId, auto: true, alias: "divisionID" }, // PK
    name: {
      type: String,
      maxlength: 255,
      trim: true,
      default: null, // Nullable
    },
  },
  {
    
    timestamps: true, // optional: adds createdAt & updatedAt
  }
);

export default mongoose.model("Division", divisionSchema,"division");
