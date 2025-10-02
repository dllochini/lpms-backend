import mongoose from "mongoose";
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    // _id: { type: String, unique: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    process: { type: Schema.Types.ObjectId, ref: "Process", required: true },
    operation: {
      type: Schema.Types.ObjectId,
      ref: "Operation",
      required: true,
    },
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

// taskSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     const count = await mongoose.model("Task").countDocuments();
//     this._id = `TASK${(count + 1).toString().padStart(5, "0")}`;
//   }
//   next();
// });

export default mongoose.model("Task", taskSchema, "task");
