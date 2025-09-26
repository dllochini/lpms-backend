import mongoose from "mongoose";
const { Schema } = mongoose;

const billSchema = new Schema(
  {
    //billID:
    process: {
      type: Schema.Types.ObjectId,
      ref: "Process",
      required: true,
    },
    total_amount: {
      type: String, // or Number if you prefer
    },
    tasksub_total: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    workdonesub_total: [
      {
        type: Schema.Types.ObjectId,
        ref: "WorkDone",
      },
    ],
    
    notes: {
      type: String,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  
);

export default mongoose.model("Bill", billSchema,"bill");
