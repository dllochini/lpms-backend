import User from "../models/user.js";

export const getAllUsers = async () => {
  const users = await User.find().populate("role", "role");
  return users;
};

export const getUser = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

export const createUser = async (userData) => {
  const newUser = await User.create(userData);
  return newUser;
};

export const updateUser = async (userId, updatedData) => {
  const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
    new: true,
  });
  return updatedUser;
};

export const deleteUser = async (userId) => {
  const deletedUser = await User.findByIdAndDelete(userId);
  return deletedUser;
};

export default {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
