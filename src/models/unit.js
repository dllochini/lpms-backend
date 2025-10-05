import mongoose from "mongoose";
const { Schema } = mongoose;

const unitSchema = new Schema(
  {
    // _id: { type: String, unique: true },
    name: { type: String, required: true, trim: true, maxlength: 255 },
    symbol: { type: String, required: true, trim: true, maxlength: 255 },
    category: { type: String, required: true, trim: true, maxlength: 255 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// unitSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     const count = await mongoose.model("Unit").countDocuments();
//     this._id = `UNIT${(count + 1).toString().padStart(5, "0")}`;
//   }
//   next();
// });

export default mongoose.model("Unit", unitSchema, "unit");
