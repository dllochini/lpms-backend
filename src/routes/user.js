import express from "express";
import {
  getUsers,
  addNewUser,
  updateUserById,
  deleteUserById,
  getUserById,
  getFarmers,
} from "../controllers/userControllers.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/farmers", getFarmers);

router.get("/:id", getUserById);

router.post("/", addNewUser);

router.put("/:id", updateUserById);

router.delete("/:id", deleteUserById);

export default router;
