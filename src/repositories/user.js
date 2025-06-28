import User from '../models/user.js';

export const getAllUsers = async () => {
  return await User.find();
};

export const createUser = async (userData) => {
  const newUser = new User(userData);
  return await newUser.save();
};

export default{
    getAllUsers,
    createUser,
} 