import mongoose from "mongoose";
const { Schema } = mongoose;

const workDoneSchema = new Schema(
  {
    // _id: { type: String, unique: true },
    resource: { type: Schema.Types.ObjectId, ref: "Resource", required: true },
    task: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    implement: { type: Schema.Types.ObjectId, ref: "Implement", required: true }, 
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    quantity: { type: Number, default: null },
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

// workDoneSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     const count = await mongoose.model("WorkDone").countDocuments();
//     this._id = `WORKDONE${(count + 1).toString().padStart(5, "0")}`;
//   }
//   next();
// });

export default mongoose.model("WorkDone", workDoneSchema, "workdone");
