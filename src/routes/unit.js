import express from "express";
import {
  getUnits,
  getUnit,
  createUnit,
  updateUnit,
  deleteUnit
} from "../controllers/unitController.js";

const router = express.Router();

router.get("/", getUnits);          // GET /units
router.get("/:id", getUnit);        // GET /units/:id
router.post("/", createUnit);       // POST /units
router.put("/:id", updateUnit);     // PUT /units/:id
router.delete("/:id", deleteUnit);  // DELETE /units/:id

export default router;
