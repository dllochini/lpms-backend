import mongoose from "mongoose";
const { Schema } = mongoose;

const billSchema = new Schema(
  {
    _id: { type: String, unique: true },
    process: {
      type: Schema.Types.ObjectId,
      ref: "Process",
      required: true,
    },
    totalAmount: {
      type: String, // or Number if you prefer
    },
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
    
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bill", billSchema,"bill");
