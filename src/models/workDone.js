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
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    quantity: { type: Number, default: null },

    // Metadata fields
    notes: { type: String, default: "" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updateHistory: { type: [Schema.Types.Mixed], default: [] }, // Array for storing change logs
  },
  
  { versionKey: false },
  { timestamps: true }
 
);

export default mongoose.model("WorkDone", workDoneSchema, "workDone");
