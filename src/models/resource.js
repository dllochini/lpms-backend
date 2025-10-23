import mongoose from "mongoose";

const { Schema } = mongoose;

const resourceSchema = new Schema(
  {
    // _id: { type: Schema.Types.ObjectId, auto: true, alias: "resourceID" },
    unit: { type: Schema.Types.ObjectId, ref: "Unit" },
    name: { type: String, maxlength: 255, trim: true, default: null },
    notes: { type: String, maxlength: 500, trim: true, default: null },
    category: { type: String, maxlength: 500, trim: true, default: null },
    unitPrice: { type: Number, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: true, // we handle created_at manually
  }
);

// resourceSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     const count = await mongoose.model("Resource").countDocuments();
//     this._id = `RESOURCE${(count + 1).toString().padStart(5, "0")}`;
//   }
//   next();
// });

export default mongoose.model("Resource", resourceSchema, "resources");
