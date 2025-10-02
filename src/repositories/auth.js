import User from "../models/user.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendResetEmail } from "../../utils/email.js"; // Assuming you have an email service to send reset emails

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() })
    .populate("role")
    .select("+password");

  // console.log("User found:", user); // Debugging line

  if (!user) {
    // do not reveal whether the email exists
    throw new Error("Invalid email");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

export const generateResetToken = async (Objdata) => {
  const { email, identifier } = Objdata.data;
  // console.log("in rep:",email,"identitiy:",identifier);
  // console.log(email);

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error("User not found");

  const token = crypto.randomBytes(32).toString("hex"); // longer token
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  user.resetPasswordToken = tokenHash;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/resetPassword?token=${token}`;
  if (identifier == "Forgot") {
    await sendResetEmail(email, resetLink);
    return { message: "Password reset email sent"};
  }

  if (identifier == "Profile") {
    // console.log("Profile!");
    return { message: "Password reset email sent", resetLink };
  }
};

// reset
export const resetPassword = async (token, newPassword) => {
  if (!token) throw new Error("Token is required");
  if (!newPassword) throw new Error("Password is required");

  // hash the token to match stored hash
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  // IMPORTANT: select the password explicitly because schema hides it by default
  const user = await User.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+password"); // <- this is the critical change

  if (!user) throw new Error("Invalid or expired token");

  // user.password is now available; still validate defensively
  if (!user.password) {
    throw new Error("Stored password not available");
  }

  // Ensure bcrypt.compare has both args
  const isMatch = await bcrypt.compare(newPassword, user.password);
  if (isMatch) throw new Error("Enter a new password");

  user.password = newPassword; // triggers pre 'save' hashing middleware
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return { message: "Password updated successfully" };
};

export default {
  loginUser,
  resetPassword,
  generateResetToken,
};
