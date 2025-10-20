import express from "express";
import { processesByLandHandler } from "../controllers/processController.js";

const router = express.Router();
router.get("/:landId", processesByLandHandler);

export default router;
