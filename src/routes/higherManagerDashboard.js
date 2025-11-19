import express from "express";
import { getHigherManagerDashboard } from "../controllers/higherManagerDashboard.js";

const router = express.Router();

router.get("/dashboard", getHigherManagerDashboard);

router.get("/cards", getHigherManagerDashboard);

router.get("/division/:divisionId/cards", getHigherManagerDashboard);

export default router;
