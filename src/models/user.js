import mongoose from "mongoose";
const { Schema } = mongoose;
import bcrypt from "bcrypt";

const userSchema = new Schema({
  // _id:String,
  designation: String,
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  firstName: String,
  lastName: String,
  fullName: String,
  email: String,
  nic: String,
  contact_no: String,
  password: String,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema, "user");
