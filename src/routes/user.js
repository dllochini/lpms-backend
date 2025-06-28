import express from "express";
import { getUsers,addNewUser } from '../controllers/userControllers.js';

const router = express.Router()


router.get('/',getUsers)
// router.get('/:id',)

router.post("/", addNewUser)

export default router;