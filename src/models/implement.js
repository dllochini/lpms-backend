import mongoose from "mongoose";
const { Schema } = mongoose;

const ImplementSchema = new Schema(
  {
    // _id: { type: String, required: true, unique: true }, // PK
    name: { type: String, required: true },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  { timestamps: true }
);

// ImplementSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     const count = await mongoose.model("Implement").countDocuments();
//     this._id = `IMPLEMENT${(count + 1).toString().padStart(5, "0")}`;
//   }
//   next();
// });

export default mongoose.model("Implement", ImplementSchema, "implement");
