import UserLogin from '../models/login.js'; 

// Fetch all users without returning their password field
export const getAllUsers = async () => {
  try {
    const users = await UserLogin.find({}, '-password'); // exclude password
    return users;
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

export default {
  getAllUsers
};


