import mongoose from "mongoose";
const { Schema } = mongoose;

const processSchema = new Schema(
  {
    // _id: { type: String, unique: true },
    land: { type: Schema.Types.ObjectId, ref: "Land", required: true },
    startedDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    status: { type: String, maxlength: 255, enum: ["Not started", "In Progress", "Done"], default: "Not started" },
    updatedHistory: [
      {
        updatedAt: { type: Date, default: Date.now },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
        changes: { type: Schema.Types.Mixed }, // optional: track what changed
      },
    ],
  },
  { timestamps: true }
);

// after processSchema definition, before export
processSchema.virtual("tasks", {
  ref: "Task",           // model name
  localField: "_id",
  foreignField: "process",
  justOne: false,
});

processSchema.set("toObject", { virtuals: true });
processSchema.set("toJSON", { virtuals: true });

// export remains the same
export default mongoose.model("Process", processSchema, "process");

