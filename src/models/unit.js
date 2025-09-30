import mongoose from "mongoose";
const { Schema } = mongoose;

const unitSchema = new Schema({
  _id: { type: String, unique: true },
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // assuming you have a User model
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    
},
{ timestamps: true }
);

export default mongoose.model("Unit", unitSchema, "unit");
