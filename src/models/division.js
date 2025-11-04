import mongoose from "mongoose";

const { Schema } = mongoose;

const divisionSchema = new Schema(
  {
    // _id: { type: String, unique: true },
    name: {
      type: String,
      maxlength: 255,
      trim: true,
      default: null, // Nullable
    },
  },
  { timestamps: true }
);

// divisionSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     const count = await mongoose.model("Division").countDocuments();
//     this._id = `DIVISION${(count + 1).toString().padStart(5, "0")}`;
//   }
//   next();
// });

export default mongoose.model("Division", divisionSchema, "division");
