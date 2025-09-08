// src/routes/resourceRoutes.js
import express from "express";
import {createResource, deleteResourceById, getAllResources, getResourceById, updateResourceById} from "../controllers/resourceController.js";

const router = express.Router();

router.post("/", createResource);
router.get("/", getAllResources);
router.get("/:id", getResourceById);
router.put("/:id", updateResourceById);
router.delete("/:id", deleteResourceById);

export default router;
