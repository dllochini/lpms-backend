// src/routes/resourceRoutes.js
import express from "express";
import { createResource, getAllResources, getResource, updateResource, deleteResource } from "../controllers/resourceController.js";

const router = express.Router();


router.post("/", createResource);
router.get("/", getAllResources);
router.get("/:id", getResource);
router.put("/:id", updateResource);
router.delete("/:id", deleteResource);

export default router;
