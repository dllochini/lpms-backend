import User from "../models/user.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendResetEmail } from "../../utils/email.js"; // Assuming you have an email service to send reset emails

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() }).populate(
    "role"
  );
  // console.log("Login attempt :", email, password);

  if (!user) {
    // console.log("Email not found");
    throw new Error("Email not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  // console.log("Password match:", isMatch);

  if (!isMatch) {
    // console.log("Incorect password");
    throw new Error("Incorect password");
  }

  // remove password before returning
  const userObj = user.toObject();
  delete userObj.password;
  // console.log("User found:", userObj);
  return userObj;
};

export const generateResetToken = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  // console.log("User found?", user);
  if (!user) throw new Error("User not found");

  // Generate token
  const token = crypto.randomBytes(20).toString("hex");

  // Save token & expiration to user
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  // Send email
  const resetLink = `${process.env.FRONTEND_URL}/resetPassword?token=${token}`;
  // console.log("RESET LINK:", resetLink);

  await sendResetEmail(email, resetLink);

  return { message: "Password reset email sent" };
};

//Password reset function
export const resetPassword = async (token, newPassword) => {
  // console.log("Call reached repository:", token, newPassword);
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }, // ensure token not expired
  });

  if (!user) throw new Error("Invalid or expired token");

  const isMatch = await bcrypt.compare(newPassword, user.password);
  // console.log("Password match:", isMatch);

  if (isMatch) {
    // console.log("Incorect password");
    throw new Error("Enter a new password");
  }

  // console.log("User found for reset:", newPassword);

  user.password = newPassword; // triggers bcrypt pre-save hook
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
