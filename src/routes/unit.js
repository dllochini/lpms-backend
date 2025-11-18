import express from "express";
import {
  getUnits,
  getUnit,
  createUnit,
  updateUnit,
  deleteUnit,
} from "../controllers/unitController.js";

const router = express.Router();

router.get("/", getUnits);
router.get("/:id", getUnit);
router.post("/", createUnit);
router.put("/:id", updateUnit);
router.delete("/:id", deleteUnit);

export default router;
