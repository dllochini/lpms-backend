import express from "express";
import { createUserAndLand } from "../controllers/createUserAndLandController.js";
import { uploadFields } from "../../utils/upload.js";

const router = express.Router();

router.post("/submit", uploadFields, createUserAndLand);

export default router;