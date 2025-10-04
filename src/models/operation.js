import mongoose from "mongoose";
const { Schema } = mongoose;

const OperationSchema = new Schema(
  {
    // _id: { type: String, unique: true },
    name: { type: String, required: true },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  { timestamps: true }
);

// OperationSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     const count = await mongoose.model("Operation").countDocuments();
//     this._id = `OPERATION${(count + 1).toString().padStart(5, "0")}`;
//   }
//   next();
// });

export default mongoose.model("Operation", OperationSchema, "operation");
