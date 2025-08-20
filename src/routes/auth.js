import express from "express";

import { login, forgotPassword, resetPasswordController } from "../controllers/authController.js";   

const router = express.Router();

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPasswordController);

export default router;
