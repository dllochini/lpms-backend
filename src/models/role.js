import mongoose from "mongoose";
const { Schema } = mongoose;

const roleSchema = new Schema({
  role: { type: Schema.Types.ObjectId, auto: true }, // PK
  name: { type: String, required: true },
});

// roleSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     const count = await mongoose.model("Role").countDocuments();
//     this._id = `ROLE${(count + 1).toString().padStart(5, "0")}`;
//   }
//   next();
// });

export default mongoose.model("Role", roleSchema, "role");
