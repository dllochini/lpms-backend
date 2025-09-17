import express from "express";
import * as workDoneController from "../controllers/workDoneController.js";

const router = express.Router();

router.post("/", workDoneController.createWorkDone);
router.get("/", workDoneController.getAllWorkDone);
router.get("/:id", workDoneController.getWorkDoneById);
router.put("/:id", workDoneController.updateWorkDone);
router.delete("/:id", workDoneController.deleteWorkDone);

export default router;
