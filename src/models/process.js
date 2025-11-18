import mongoose from "mongoose";
const { Schema } = mongoose;

const processSchema = new Schema(
  {
    land: { type: Schema.Types.ObjectId, ref: "Land", required: true },
    startedDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    status: {
      type: String,
      maxlength: 255,
      enum: ["Not started", "In Progress", "Done", "Sent for Payment Approval"],
      default: "Not started",
    },
    updatedHistory: [
      {
        updatedAt: { type: Date, default: Date.now },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
        changes: { type: Schema.Types.Mixed },
      },
    ],
  },
  { timestamps: true }
);

processSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "process",
  justOne: false,
});

processSchema.set("toObject", { virtuals: true });
processSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Process", processSchema, "process");
