import {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
  getUser,
} from "../repositories/user.js";

//get Users
export const getUsers = async (req, res) => {
  try {
    const results = await getAllUsers();
    console.log(results.length, "results");
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//add Users
export const addNewUser = async (req, res) => {
  try {
    console.log("In controller:", req.body); // Log the request body
    if (!req.body.division) {
      delete req.body.division; // removes empty string field
    }
    const savedUser = await createUser(req.body);
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update user controller (PUT /users/:id)
export const updateUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    if (!req.body.division) {
      delete req.body.division; // removes empty string field
    }
    const updatedUser = await updateUser(userId, req.body);
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete user controller (DELETE /users/:id)
export const deleteUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await deleteUser(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  getUsers,
  addNewUser,
  updateUserById,
  deleteUserById,
};