// routes/higherManager.js
import express from "express";
import { getHigherManagerDashboard } from "../controllers/higherManagerDashboard.js";

const router = express.Router();

// Example route: GET dashboard for a specific higher manager
router.get("/division/:divisionId/card", getHigherManagerDashboard);

export default router;
