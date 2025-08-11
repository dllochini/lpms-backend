import express from "express";
import {  getUsers} from '../controller/user_loginController.js';

const router = express.Router();

// Get all users
router.get('/', getUsers);



export default router;










// // Add a new user
// router.post('/', addNewUser);

// // Update a user by ID
// router.put('/:id', updateUser);

// // Delete a user by ID
// router.delete('/:id', deleteUser);