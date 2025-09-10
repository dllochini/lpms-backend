import express from "express";
import {
  getLands,
  getLandById,
  addNewLand,
  updateLandById,
  deleteLandById,
} from "../controllers/landController.js";

const router = express.Router();

// Route to get all lands
router.get("/", getLands);

// Route to get a land by ID
router.get("/:id", getLandById);

// Route to add a new land
router.post("/", addNewLand);

// Route to update a land by ID
router.put("/:id", updateLandById);

// Route to delete a land by ID
router.delete("/:id", deleteLandById);

export default router;
