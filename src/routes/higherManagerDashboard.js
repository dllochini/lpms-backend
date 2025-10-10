// routes/higherManager.js
import express from "express";
import { getHigherManagerDashboard } from "../controllers/higherManagerDashboard.js";

const router = express.Router();

// Example route: GET dashboard for a specific higher manager
router.get("/higherManager/:higherManagerId/dashboard", getHigherManagerDashboard);

export default router;
