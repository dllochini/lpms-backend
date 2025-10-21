// routes/higherManager.js
import express from "express";
import { getHigherManagerDashboard } from "../controllers/higherManagerDashboard.js";

const router = express.Router();

// GET dashboard for a specific division (handled by higherManager dashboard controller)
router.get("/land/:landId/card", getHigherManagerDashboard);

export default router;
