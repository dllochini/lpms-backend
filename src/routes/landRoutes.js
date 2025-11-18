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

router.get("/", getLands);

router.get("/fieldOfficer/:fieldOfficerId", getLandsByFieldOfficerId);
router.get("/manager/:managerId", getLandsByDivisionId);

router.get("/:id", getLandById);

router.put("/:id", updateLandById);

router.delete("/:id", deleteLandById);

export default router;
