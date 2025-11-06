// File: routes/createUserLandRoutes.js
import express from "express";
import { createUserAndLand } from "../controllers/createUserAndLandController.js";
import { uploadFields } from "../../utils/upload.js";

const router = express.Router();

// This route will be /api/createUserLand/submit
router.post("/submit", uploadFields, createUserAndLand);

export default router;