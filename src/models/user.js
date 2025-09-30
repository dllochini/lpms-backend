import mongoose from "mongoose";
const { Schema } = mongoose;
import bcrypt from "bcrypt";

const userSchema = new Schema({
  customId: { type: String, unique: true }, // <-- here
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
  fullName: String,
  nic: String,
  email: String,
  contactNo: String,
  password: { type: String, required: true, select: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date,

 
  createdBy: {
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
  accountNumber: {
    type: Number,
    default: null,
  },
  passportNumber: {
    type: Number,
    default: null,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  designation: {
    type: String,
    default: null,
  },
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

