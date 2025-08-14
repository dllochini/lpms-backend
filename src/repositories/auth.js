import User from '../models/user.js';
import bcrypt from 'bcrypt';

/**
 * Login user by email and password
 */
export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).populate("role", "role");

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return user;
};

/**
 * Reset password
 */
export const resetPassword = async (email, newPassword) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  return user;
};

export default {
  loginUser,
  resetPassword
};


