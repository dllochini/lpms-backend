

import mongoose from "mongoose";
const { Schema } = mongoose;
import bcrypt from "bcrypt";

const userSchema = new Schema({
  designation: String,
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  division: {
    type: Schema.Types.ObjectId,
    ref: "Division",
    required: false,
    default: null,
  },
  // firstName: String,
  // lastName: String,
  fullName: String,
  email: String,
  nic: String,
  contact_no: String,
  customId: { type: String, unique: true }, // <-- here
  password: { type: String, required: true, select: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  if (this.isNew) {
    const prefix = this.designation?.toLowerCase() === "farmer" ? "F" : "U";
    const count = await mongoose.model("User").countDocuments({
      customId: new RegExp(`^${prefix}`),
    });
    this.customId = `${prefix}${count + 1}`.padStart(5, "0");
  }

  next();
});

export default mongoose.model("User", userSchema, "user");