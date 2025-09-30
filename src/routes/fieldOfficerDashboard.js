// routes/fieldOfficer.js
import express from "express";
import { getFieldOfficerDashboard } from "../controllers/fieldOfficerDashboard.js"; // <-- fixed

const router = express.Router();

// Example route: GET dashboard for a specific land
router.get("/land/:landId/cards", getFieldOfficerDashboard);

export default router;
