import express from "express";
import { addNewLand } from "../controllers/landControllers.js";

const router = express.Router()

router.post("/", addNewLand)

export default router;