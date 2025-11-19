import mongoose from "mongoose";
const { Schema } = mongoose;

const billSchema = new Schema(
  {
    process: { type: Schema.Types.ObjectId, ref: "Process", required: true },
    totalAmount: { type: Number, default: 0 },
    taskSubTotals: [
      {
        task: { type: Schema.Types.ObjectId, ref: "Task" },
        subtotal: { type: Number, default: 0 },
      },
    ],
    workdoneSubTotals: [
      {
        workDone: { type: Schema.Types.ObjectId, ref: "WorkDone" },
        amount: { type: Number, default: 0 },
      },
    ],
    notes: { type: String },
    status: {
      type: String,
      enum: [
        "Sent for Manager Approval",
        "Approved",
        "Sent for Payment Approval",
      ],
      default: "Sent for Manager Approval",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bill", billSchema, "bill");
