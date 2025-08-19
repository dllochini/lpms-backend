import User from "../models/user.js";
import bcrypt from "bcrypt";

export const loginUser = async (email, password) => {
  // const user = await User.findOne({ email }).populate("role", "role");
  const user = await User.findOne({ email: email.toLowerCase() }).populate("role");

  if (!user) {
    throw new Error("Email not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Incorect password");
  }

  // remove password before returning
  const userObj = user.toObject();
  delete userObj.password;

  // Convert role name to lowercase if role exists
  if (userObj.role && userObj.role.name) {
    userObj.role.name = userObj.role.name.toLowerCase();
  }

  return userObj;
};

export const resetPassword = async (email, newPassword) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error("User not found");
  }

  // assigning new password will trigger pre("save") hook in model → password gets hashed
  user.password = newPassword;
  await user.save();

  const userObj = user.toObject();
  delete userObj.password;

  return userObj;

  // const salt = await bcrypt.genSalt(10);
  // user.password = await bcrypt.hash(newPassword, salt);
  // await user.save();

  // return user;
};

export default {
  loginUser,
  resetPassword,
};
