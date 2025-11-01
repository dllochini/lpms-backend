// routes/billRoutes.js
import express from "express";
import { createBillForProcessHandler, getBillByProcess, getBillsByDivisionController, updateBillById } from "../controllers/billController.js";
const router = express.Router();

router.post("/create", createBillForProcessHandler);
router.get("/:userId", getBillsByDivisionController);
router.put("/:billId", updateBillById);
router.get("/process/:processId", getBillByProcess);

export default router;
