import User from "../models/user.js";

export const getAllUsers = async () => {
  return await User.find();
};

export const getUser = async (userId) => {
  return await User.findById(userId);
};

export const createUser = async (userData) => {
  const newUser = new User(userData);
  return await newUser.save();
};

export const updateUser = async (userId, updatedData) => {
  return await User.findByIdAndUpdate(userId, updatedData, { new: true });
};

export const deleteUser = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

export default {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
