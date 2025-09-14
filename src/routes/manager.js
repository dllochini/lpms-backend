import express from "express";
import {
  getLands,
  getLandById,
} from "../controllers/landController.js";

const router = express.Router();

// Route to get all lands
router.get("/", getLands);

// Route to get a land by ID
router.get("/:id", getLandById);


export default router;
