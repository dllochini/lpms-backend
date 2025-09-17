import mongoose from "mongoose";
const { Schema } = mongoose;

const workDoneSchema = new Schema(
  {
    resource: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    implement: {
      type: Schema.Types.ObjectId,
      ref: "Implement",
      required: true,
    },
    start_date: { type: Date, default: null },
    end_date: { type: Date, default: null },
    quantity: { type: Number, default: null },

    // Metadata fields
    notes: { type: String, default: "" },
    created_at: { type: Date, default: Date.now },
    created_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updated_at: { type: Date, default: null },
    updated_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
    update_history: { type: [Schema.Types.Mixed], default: [] }, // Array for storing change logs
  },
  { versionKey: false }
);

export default mongoose.model("WorkDone", workDoneSchema, "workDone");
