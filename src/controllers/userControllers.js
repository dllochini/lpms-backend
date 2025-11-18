import {
  getAllUsers,
  createUser as createUserRepo,
  getUser,
  updateUser,
  deleteUser,
  getAllFarmers,
} from "../repositories/user.js";

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFarmers = async (req, res) => {
  try {
    const farmers = await getAllFarmers();
    // console.log("Farmers:", farmers);
    res.json(farmers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await getUser(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addNewUser = async (req, res) => {
  try {
    const userData = req.body;

    if (req.file) {
      userData.nic_softcopy = {
        filename: req.file.filename,
        path: req.file.path,
      };
    }

    if (!userData.division) delete userData.division;
    const newUser = await createUserRepo(userData);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const updatedData = req.body;
    if (!updatedData.division) delete updatedData.division;
    const updatedUser = await updateUser(userId, updatedData);
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const deleted = await deleteUser(userId);
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  getUsers,
  getUserById,
  addNewUser,
  updateUserById,
  deleteUserById,
};
