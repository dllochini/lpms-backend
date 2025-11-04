import express from "express";
import {getOperations, getOperation, createOperation, updateOperation, deleteOperation} from "../controllers/operationController.js";

const router = express.Router();

router.get("/", getOperations);
router.get("/:id",getOperation);
router.post("/",createOperation);
router.put("/:id",updateOperation);
router.delete("/:id",deleteOperation);

export default router;
