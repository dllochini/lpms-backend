import mongoose from "mongoose";
const { Schema } = mongoose;
import bcrypt from 'bcrypt';

const userSchema = new Schema({
  // _id:String,
  designation: String,
  role: String,
  firstName: String, // String is shorthand for {type: String}
  lastName: String,
  fullName: String,
  email: String,
  nic: String,
  contact_no: String,
  confirmPassword: String,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("confirmPassword")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.confirmPassword = await bcrypt.hash(this.confirmPassword, salt);
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("User", userSchema, "user");
