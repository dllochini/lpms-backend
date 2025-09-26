// routes/manager.js
import express from "express";
import { getDivisionDashboard } from "../controllers/managerDashboardController";

const router = express.Router();

router.get("/division/:divisionId/cards", getDivisionDashboard);

export default router;
