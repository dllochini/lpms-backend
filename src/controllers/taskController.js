import * as taskRepo from "../repositories/task.js"; 

export const createTask = async (req, res) => {
  try {
    const taskData = req.body;
    const newTask = await taskRepo.createTask(taskData);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Failed to create task", error });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskRepo.getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks", error });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await taskRepo.getTaskById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Failed to fetch task", error });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedTask = await taskRepo.updateTask(id, updateData);
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Failed to update task", error });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await taskRepo.deleteTask(id);
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Failed to delete task", error });
  }
};
