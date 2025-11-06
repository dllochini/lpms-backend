// File: routes/landRoutes.js
import express from "express";
import {
  getLands,
  getLandById,
  updateLandById,
  deleteLandById,
  getLandsByFieldOfficerId,
  getLandsByDivisionId,
} from "../controllers/landController.js";

const router = express.Router();

// This route will be /api/lands/
router.get("/", getLands);

// These must be defined BEFORE the /:id route
router.get("/fieldOfficer/:fieldOfficerId", getLandsByFieldOfficerId);
router.get("/manager/:managerId", getLandsByDivisionId);

// This route will be /api/lands/:id
router.get("/:id", getLandById);

// This route will be /api/lands/:id
router.put("/:id", updateLandById);

// This route will be /api/lands/:id
router.delete('/:id', deleteLandById);

export default router;