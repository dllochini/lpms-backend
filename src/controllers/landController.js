import {
  getAllLands,
  createLand,
  deleteLand,
  updateLand,
  getLand,
} from "../repositories/land.js";

// Get all lands
export const getLands = async (req, res) => {
  try {
    const results = await getAllLands();
    console.log(results.length, "lands found ");
    res.json(results);
  } catch (error) {
    console.error("Error fetching lands:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get land by ID
export const getLandById = async (req, res) => {
  const landId = req.params.id;
  try {
    const land = await getLand(landId);
    if (!land) {
      return res.status(404).json({ error: "Land not found" });
    }
    res.json(land);
  } catch (error) {
    console.error("Error fetching land:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add new land
export const addNewLand = async (req, res) => {
  try {
    const savedLand = await createLand(req.body);
    res.status(201).json(savedLand);
  } catch (error) {
    console.error("Error saving land:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update land by ID
export const updateLandById = async (req, res) => {
  const landId = req.params.id;
  try {
    const updatedLand = await updateLand(landId, req.body);
    if (!updatedLand) {
      return res.status(404).json({ error: "Land not found" });
    }
    res.status(200).json(updatedLand);
  } catch (error) {
    console.error("Error updating land:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete land by ID
export const deleteLandById = async (req, res) => {
  const landId = req.params.id;
  try {
    const deletedLand = await deleteLand(landId);
    if (!deletedLand) {
      return res.status(404).json({ error: "Land not found" });
    }
    res.status(200).json({ message: "Land deleted successfully" });
  } catch (error) {
    console.error("Error deleting land:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  getLands,
  getLandById,
  addNewLand,
  updateLandById,
  deleteLandById,
};
