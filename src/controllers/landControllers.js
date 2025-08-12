import { createLand } from "../repositories/land.js";

//add Users
export const addNewLand = async (req, res) => {
  try {
    const savedLand = await createLand(req.body);
    res.status(201).json(savedLand);
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default{
    addNewLand,
}

