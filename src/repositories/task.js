import mongoose from "mongoose";
import Task from "../models/task.js"; // Adjust the path if needed


// Create a new Task
export const createTask = async (taskData) => {
  const task = new Task(taskData);
  const newtask = await task.save();
  return newtask;
};

// Get all Tasks
export const getAllTasks = async () => {
  const tasks = await Task.find()
    .populate("process")
    .populate("operation");
  return tasks;
};

// Get a Task by ID
export const getTaskById = async (id) => {
  const task = await Task.findById(id)
    .populate("process")
    .populate("operation");
  return task;
};

// Update a Task by ID
// src/repositories/task.js

export const updateTask = async (id, updateData) => {
  // normalize id if caller accidentally passed { id: '...' }
  const taskId = typeof id === "object" && id !== null && id.id ? id.id : id;

  // basic validation
  if (!taskId || !mongoose.Types.ObjectId.isValid(String(taskId))) {
    throw new Error("Invalid task id");
  }

  const updated = await Task.findByIdAndUpdate(String(taskId), updateData, { new: true });
  return updated;
};


export const updateTaskStatus = async (id, status) => {
  const updateStatus = await Task.findByIdAndUpdate(
    id,
    { status },   // must be an object
    { new: true } // return the updated document
  );
  return updateStatus;
};


// Delete a Task by ID
export const deleteTask = async (id) => {
  const deleteTask = await Task.findByIdAndDelete(id);
  return deleteTask;
};
