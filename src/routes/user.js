import express from "express";
import { getUsers,addNewUser, updateUserById, deleteUserById, getUserById } from '../controllers/userControllers.js';

// This line creates a new "mini app" inside your main Express app. 
// his "mini app" (called a router) lets you group related routes together —
// for example, all the routes related to users.
const router = express.Router()

router.get('/',getUsers)

router.get('/:id',getUserById)

router.post("/", addNewUser)

router.put("/:id",updateUserById)

router.delete("/:id",deleteUserById)

export default router;