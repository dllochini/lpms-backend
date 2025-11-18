import express from "express";
import {
  getLands,
  getLandById,
  updateLandById,
  deleteLandById,
  getLandsByFieldOfficerId,
  getLandsByDivisionId,
} from "../controllers/landController.js";
import { createUserAndLand } from "../controllers/createUserAndLandController.js";
import { uploadFields } from "../../utils/upload.js";

const router = express.Router();

router.post("/submit", uploadFields, createUserAndLand);

router.get("/", getLands);

router.get("/fieldOfficer/:fieldOfficerId", getLandsByFieldOfficerId);
router.get("/manager/:managerId", getLandsByDivisionId);

router.get("/:id", getLandById);

router.put("/:id", updateLandById);

router.delete("/:landId", deleteLandById);

export default router;
