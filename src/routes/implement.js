import express from "express";
import { fetchImplementsByOperationId } from "../controllers/implementController.js";

const router = express.Router();

router.get("/:id", fetchImplementsByOperationId);

export default router;