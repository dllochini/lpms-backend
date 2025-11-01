import express from "express";
import { getManagerDashboardCardInfo } from "../controllers/managerDashboard.js";

const router = express.Router();

// GET dashboard for a specific division
router.get("/division/:divisionId/cards", getManagerDashboardCardInfo);

export default router;
