import mongoose from "mongoose";
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    // _id: { type: String, unique: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    process: { type: Schema.Types.ObjectId, ref: "Process", required: true },
    operation: { type: Schema.Types.ObjectId, ref: "Operation", required: true },

    resource: { type: Schema.Types.ObjectId, ref: "Resource", required: true },
    estTotalWork: { type: String }, //new
    
    startDate: { type: Date, required: true },
    expectedEndDate: { type: Date, required: true },
    endDate: { type: Date },
    status: { type: String, required: true, enum: ["Pending", "In Progress", "Completed", "Sent for approval"], default: "Pending" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
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

// after taskSchema definition, before export
taskSchema.virtual("workDones", {
  ref: "WorkDone",
  localField: "_id",
  foreignField: "task",
  justOne: false,
});

taskSchema.set("toObject", { virtuals: true });
taskSchema.set("toJSON", { virtuals: true });

// index to speed lookups
taskSchema.index({ process: 1 });

export default mongoose.model("Task", taskSchema, "task");

