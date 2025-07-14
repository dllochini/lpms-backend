import express from "express";
import { getUsers,addNewUser } from '../controllers/userControllers.js';

// This line creates a new "mini app" inside your main Express app. 
// his "mini app" (called a router) lets you group related routes together —
// for example, all the routes related to users.
const router = express.Router()

router.get('/',getUsers)

router.post("/", addNewUser)

export default router;