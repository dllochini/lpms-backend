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
    .populate("land")
    .populate("operation");
  return tasks;
};

// Get a Task by ID
export const getTaskById = async (id) => {
  const task = await Task.findById(id)
    .populate("land")
    .populate("operation");
  return task;
};

// Update a Task by ID
export const updateTask = async (id, updateData) => {
  const updateTask = await Task.findByIdAndUpdate(id, updateData, { new: true });
  return updateTask;
};

// Delete a Task by ID
export const deleteTask = async (id) => {
  const deleteTask = await Task.findByIdAndDelete(id);
  return deleteTask;
};
