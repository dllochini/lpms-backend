import express from "express";
import { createProcessById, deleteProcessById, processesByLandHandler, updateProcessById } from "../controllers/processController.js";

const router = express.Router();
router.get("/:landId", processesByLandHandler);
router.put("/:processId", updateProcessById);
router.post("/", createProcessById);
router.delete("/:processId", deleteProcessById);

export default router;
