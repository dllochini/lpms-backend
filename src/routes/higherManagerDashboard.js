// routes/higherManager.js
import express from "express";
import { getHigherManagerDashboard } from "../controllers/higherManagerDashboard.js";

const router = express.Router();

// GET dashboard for a land OR manager
// If the manager has no assigned land, call: /dashboard?managerId=<managerId>
router.get("/dashboard", getHigherManagerDashboard);

// Optional: keep the land-specific route for backward compatibility
router.get("/land/:landId/card", getHigherManagerDashboard);

export default router;
