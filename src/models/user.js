

import mongoose from "mongoose";
const { Schema } = mongoose;
import bcrypt from "bcrypt";

const userSchema = new Schema({
  // _id:String,
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  // firstName: String,
  // lastName: String,
  fullName: String,
  nic: String,
  email: String,
  contact_no: String,
  password: { type: String, required: true, select: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  bank: {
    type: String,
    default: null,
  },
  branch: {
    type: String,
    default: null,
  },
  account_Number: {
    type: Number,
    default: null,
  },
  passport_number: {
    type: Number,
    default: null,
  },
   updated_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  designation: {
    type: String,
    default: null,
  },
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

export default mongoose.model("User", userSchema, "user");

    