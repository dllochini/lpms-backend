import mongoose from "mongoose";
const { Schema } = mongoose;

const taskSchema = new Schema(

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    process: {
      type: Schema.Types.ObjectId,
      ref: "Process",
      required: true,
    },
    operation: {
      type: Schema.Types.ObjectId,
      ref: "Operation",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    expectedEndDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updateHistory: [
      {
        updatedAt: Date,
        updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
        changes: String,
      },
    ],
  },
  { versionKey: false },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema, "task");
