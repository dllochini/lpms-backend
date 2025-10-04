import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    // customId: { type: String, unique: true }, // <-- here
    role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    division: { type: Schema.Types.ObjectId, ref: "Division", default: null },
    designation: { type: String, default: null },
    fullName: String,
    nic: String,
    passportNumber: { type: Number, default: null },
    email: String,
    address: { type: String, default: null },
    accountNumber: { type: Number, default: null },
    bank: { type: String, default: null },
    branch: { type: String, default: null },
    contactNo: String,
    password: { type: String, select: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updateHistory: [
      {
        updatedAt: Date,
        updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
        changes: String,
      },
    ],
  },
  { timestamps: true }
);

// Pre-save hook
userSchema.pre("save", async function (next) {
  // Hash password only if provided
  if (this.isModified("password") && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  next();
  // Generate customId
//   if (this.isNew) {
//     const prefix = this.designation?.toLowerCase() === "farmer" ? "F" : "U";
//     const count = await mongoose.model("User").countDocuments({
//       customId: new RegExp(`^${prefix}`),
//     });
//     this.customId = `${prefix}${(count + 1).toString().padStart(4, "0")}`;
//   }

});

export default mongoose.model("User", userSchema, "user");
