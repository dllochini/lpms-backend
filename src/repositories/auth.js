import User from "../models/user.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendResetEmail } from "../../utils/email.js"; // Assuming you have an email service to send reset emails

export const loginUser = async (email, password) => {
  // console.log("in loginUser", email, password);
  const user = await User.findOne({ email: email.toLowerCase() })
    .populate("role")
    .select("+password");

  // console.log("User found:", user); // Debugging line

  if (!user) {
    // do not reveal whether the email exists
    throw new Error("Invalid email");
  }
  // console.log("Stored hash:", user.password);
  const isMatch = await bcrypt.compare(password, user.password);
  console.log("Password match:", isMatch);
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

export const generateResetToken = async (objData) => {
  const { email, identifier } = objData.data;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error("User not found");

  // Generate token and hash it
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  user.resetPasswordToken = tokenHash;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/resetPassword?token=${token}&identifier=${identifier}`;

  if (identifier === "Forgot") {
    await sendResetEmail(email, resetLink);
    return { message: "Password reset email sent", resetLink };
  }

  return { message: "Reset token generated", resetLink };
};

export const resetPassword = async (
  token,
  newPassword,
  identifier,
  loggedUserId
) => {
  console.log("in resetPassword", token, newPassword, identifier, loggedUserId);

  // Hash token from URL
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  let user;
  // Case 1: Forgot Password (find user by reset token)
  if (identifier === "Profile" && loggedUserId) {
    user = await User.findById(loggedUserId).select("+password");
  } else {
    if (!token) throw new Error("Reset token missing");
    user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+password");
  }

  // Case 2: Change from Profile (find by logged-in userId instead)

  if (!user) throw new Error("Invalid or expired token");

  // 🚨 Check if new password matches the old password
  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    throw new Error("New password cannot be the same as the old password");
  }

  // Assign plain password (pre-save hook will hash it)
  user.password = newPassword;

  // Record update history
  user.updateHistory.push({
    updatedAt: new Date(),
    updatedBy: identifier === "Profile" ? loggedUserId : null,
    changes:
      identifier === "Profile"
        ? "Change Password by User"
        : "Forgot Password - Reset",
  });

  // Clear reset token fields (only relevant for forgot password flow)
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
  return { message: "Password has been reset successfully" };
};

export default {
  loginUser,
  resetPassword,
  generateResetToken,
};
