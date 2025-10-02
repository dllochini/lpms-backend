import express from "express";
import {
  getLands,
  getLandById,
  updateLandById,
  deleteLandById,
  getLandsByFieldOfficerId,
} from "../controllers/landController.js";
import { createUserAndLand } from "../controllers/createUserAndLandController.js";
import { uploadFields } from "../../utils/upload.js";

const router = express.Router();

router.post("/submit", uploadFields, createUserAndLand);

// Route to get all lands
router.get("/", getLands);

// Route to get a land by ID
router.get("/:id", getLandById);

// Route to update a land by ID
router.put("/:id", updateLandById);

// Route to delete a land by ID
router.delete("/:landId", deleteLandById);

router.get("/fieldOfficer/:fieldOfficerId", getLandsByFieldOfficerId);

export default router;
