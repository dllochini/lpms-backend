import express from "express";
import { getUsers,addUser } from '../controllers/userControllers.js';

const router = express.Router()


router.get('/',getUsers)
// router.get('/:id',)

router.post("/", addUser)

export default router;