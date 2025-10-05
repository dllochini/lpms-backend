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

// processSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     const count = await mongoose.model("Process").countDocuments();
//     this._id = `PROCESS${(count + 1).toString().padStart(5, "0")}`;
//   }
//   next();
// });

export default mongoose.model("Process", processSchema, "process");
