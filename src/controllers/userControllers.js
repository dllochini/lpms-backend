import { getAllUsers,createUser } from '../repositories/user.js';

export const getUsers = async (req, res) => {
  try {
    const results = await getAllUsers();
    console.log(results.length,'results')
    res.json(results);
  } catch (error) {
    console.log(error)
  }
}

export const addNewUser = async (req, res) => {
  try {
    const savedUser = await createUser(req.body);
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default{
    getUsers,
    addNewUser,
}

