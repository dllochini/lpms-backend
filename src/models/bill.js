import mongoose from "mongoose";
const { Schema } = mongoose;

const billSchema = new Schema(
  {
    // _id: { type: String, unique: true },
    process: { type: Schema.Types.ObjectId, ref: "Process", required: true },
    totalAmount: { type: String },
    taskSubTotal: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    workdoneSubTotal: [
      {
        type: Schema.Types.ObjectId,
        ref: "WorkDone",
      },
    ],
    notes: { type: String },
    status: { type: String, enum: ["Sent for Manager Approval", "Sent for Higher Manager Approval", "Approved"], default: "Sent for Manager Approval" },
  },
  { timestamps: true }
);

// billSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     const count = await mongoose.model("Bill").countDocuments();
//     this._id = `BILL${(count + 1).toString().padStart(5, "0")}`;
//   }
//   next();
// });


export default mongoose.model("Bill", billSchema, "bill");
