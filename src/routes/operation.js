import express from "express";
import * as operationController from "../controllers/operationController.js";

const router = express.Router();

router.get("/", operationController.getOperations);
router.get("/:id", operationController.getOperation);
router.post("/", operationController.createOperation);
router.put("/:id", operationController.updateOperation);
router.delete("/:id", operationController.deleteOperation);

export default router;
