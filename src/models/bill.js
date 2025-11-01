// models/bill.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const billSchema = new Schema(
  {
    process: { type: Schema.Types.ObjectId, ref: "Process", required: true },

    // numeric total (use Number for arithmetic)
    totalAmount: { type: Number, default: 0 },

    // per-task subtotal objects
    taskSubTotals: [
      {
        task: { type: Schema.Types.ObjectId, ref: "Task" },
        subtotal: { type: Number, default: 0 },
      },
    ],

    // per-workdone amounts (optional — keeps traceability)
    workdoneSubTotals: [
      {
        workDone: { type: Schema.Types.ObjectId, ref: "WorkDone" },
        amount: { type: Number, default: 0 },
      },
    ],

    notes: { type: String },

    status: {
      type: String,
      enum: ["Sent for Manager Approval", "Approved", "Sent for Payment Approval"],
      default: "Sent for Manager Approval",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bill", billSchema, "bill");
 