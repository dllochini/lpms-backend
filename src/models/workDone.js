import mongoose from "mongoose";
const { Schema } = mongoose;

const workDoneSchema = new Schema(
  {
    // _id: { type: String, unique: true },
    // resource: { type: Schema.Types.ObjectId, ref: "Resource", required: true },
    task: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    // implement: { type: Schema.Types.ObjectId, ref: "Implement", required: true }, 
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    newWork: { type: Number, default: null }, //new 
    notes: { type: String, default: "" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updateHistory: [
      {
        updatedAt: Date,
        updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
        changes: String,
      },
    ],
  },
  { timestamps: true }
);

workDoneSchema.index({ task: 1 });

export default mongoose.model("WorkDone", workDoneSchema, "workdone");
