import express from "express";
import { getFieldOfficerDashboard } from "../controllers/fieldOfficerDashboard.js";

const router = express.Router();

router.get("/division/:divisionId/cards", getFieldOfficerDashboard);

export default router;
