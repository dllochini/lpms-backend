import mongoose from "mongoose";
const { Schema } = mongoose;

const operationImplementSchema = new Schema(
  {
    // _id: { type: String, unique: true },
    operation: { type: Schema.Types.ObjectId, ref: "Operation", required: true },
    implement: { type: Schema.Types.ObjectId, ref: "Implement", required: true },
  },
  { timestamps: true }
);

// operationImplementSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     const count = await mongoose.model("OperationImplement").countDocuments();
//     this._id = `OPERATIONIMPLEMENT${(count + 1).toString().padStart(5, "0")}`;
//   }
//   next();
// });

export default mongoose.model("OperationImplement", operationImplementSchema, "operationImplement");
