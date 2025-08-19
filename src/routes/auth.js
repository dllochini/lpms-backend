import express from "express";
import { login, passwordReset } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/reset-password", passwordReset);

export default router;
