import mongoose from "mongoose";
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
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
    start_date: {
      type: Date,
      required: true,
    },
    expected_end_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updated_at: {
      type: Date,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    update_history: [
      {
        updated_at: Date,
        updated_by: { type: Schema.Types.ObjectId, ref: "User" },
        changes: String,
      },
    ],
  },
  { versionKey: false }
);

export default mongoose.model("Task", taskSchema, "task");
