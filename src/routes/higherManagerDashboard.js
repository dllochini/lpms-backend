import express from "express";
import { getHigherManagerDashboard } from "../controllers/higherManagerDashboard.js";

const router = express.Router();

// Global dashboard or filtered by divisionId (optional query param)
router.get("/dashboard", getHigherManagerDashboard);

// Dashboard cards for a specific division
router.get("/division/:divisionId/cards", getHigherManagerDashboard);

export default router;
