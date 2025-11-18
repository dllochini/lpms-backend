import express from "express";
import { getManagerDashboardCardInfo } from "../controllers/managerDashboard.js";

const router = express.Router();

router.get("/division/:divisionId/cards", getManagerDashboardCardInfo);

export default router;
