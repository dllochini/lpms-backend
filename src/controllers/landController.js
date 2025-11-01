import {
  getAllLands,
  createLand,
  deleteLand,
  updateLand,
  getLand,
  getLandsByFieldOfficer,
  getLandsByDivision,
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

export const addNewLand = async (req, res) => {
  try {
    const landData = req.body;

    // Handle uploaded files
    if (req.files) {
      if (req.files.images) {
        landData.images = req.files.images.map((f) => ({
          filename: f.filename,
          path: f.path,
        }));
      }
      if (req.files.documents) {
        landData.documents = req.files.documents.map((f) => ({
          filename: f.filename,
          path: f.path,
        }));
      }
      if (req.files.signed_agreement) {
        landData.signed_agreement = {
          filename: req.files.signed_agreement[0].filename,
          path: req.files.signed_agreement[0].path,
        };
      }
    }

    const newLand = await createLand(landData);
    res.status(201).json(newLand);
  } catch (error) {
    console.error(error);
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

export const getLandsByFieldOfficerId = async (req, res) => {
  try {
    // console.log("in controller");
    const { fieldOfficerId } = req.params;
    const lands = await getLandsByFieldOfficer(fieldOfficerId);
    res.json(lands);
  } catch (error) {
    console.error("Error fetching lands by field officer:", error);
    res.status(500).json({ error: "Failed to fetch lands progress" });
  }
};

export const getLandsByDivisionId = async (req, res) => {
  try {
    console.log("in controller");
    const { managerId } = req.params;
    const lands = await getLandsByDivision(managerId);
    res.json(lands);
  } catch (error) {
    console.error("Error fetching lands by field officer:", error);
    res.status(500).json({ error: "Failed to fetch lands progress" });
  }
};

export default {
  getLands,
  getLandById,
  addNewLand,
  updateLandById,
  deleteLandById,
  getLandsByFieldOfficerId,
};
