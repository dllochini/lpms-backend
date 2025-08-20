// src/routes/resourceRoutes.js
import express from "express";
import * as resourceController from "../controllers/resourceController.js";

const router = express.Router();


router.post("/", resourceController.createResource);
router.get("/", resourceController.getAllResources);
router.get("/:id", resourceController.getResourceById);
router.put("/:id", resourceController.updateResource);
router.delete("/:id", resourceController.deleteResource);

export default router;
