import mongoose from "mongoose";
import Task from "../models/task.js"; // Adjust the path if needed
import User from "../models/user.js";
import WorkDone from "../models/workDone.js";

export const createTask = async (taskData) => {
  const task = new Task(taskData);
  const newtask = await task.save();
  return newtask;
};

// Get all Tasks
export const getAllTasks = async () => {
  const tasks = await Task.find().populate("process").populate("operation");
  return tasks;
};

export const getAllTasksByDiv = async (userId) => {
  try {
    if (!userId) {
      console.warn("getAllTasksByDiv: no userId provided");
      return [];
    }

    const manager = await User.findById(userId).lean();
    if (!manager) {
      console.warn("getAllTasksByDiv: manager not found for id", userId);
      return [];
    }

    const divisionId = manager.division?._id ?? manager.division;
    if (!divisionId) {
      console.warn("getAllTasksByDiv: manager has no division:", userId);
      return [];
    }

    // find field officers in that division
    const fieldOfficers = await User.find({ division: divisionId }).select("_id").lean();
    const fieldOfficerIds = fieldOfficers.map((fo) => fo._id);

    if (!fieldOfficerIds.length) {
      return [];
    }

    const tasks = await Task.find({
      assignedTo: { $in: fieldOfficerIds },
      status: "Sent for approval",
    }).populate({ path: "process", populate: { path: "land" } }).populate("operation").populate("assignedTo")
      .populate({ path: "resource", populate: { path: "unit" } }).lean();

    if (!tasks.length) {
      return [];
    }

    const taskIds = tasks.map((t) => t._id);
    const workDones = await WorkDone.find({ task: { $in: taskIds } })
      .select("_id task startDate endDate newWork notes")
      .lean();

    const workDonesByTask = workDones.reduce((acc, wd) => {
      const key = String(wd.task);
      if (!acc[key]) acc[key] = [];
      acc[key].push(wd);
      return acc;
    }, {});

    // attach the workDones array to each task
    const tasksWithWork = tasks.map((t) => {
      const key = String(t._id);
      return {
        ...t,
        workDones: workDonesByTask[key] ?? [],
      };
    });

    return tasksWithWork;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const getTaskById = async (id) => {
  const task = await Task.findById(id).populate("process").populate("assignedTo").populate("operation");
  return task;
};

export const updateTask = async (id, updateData) => {
  const taskId = typeof id === "object" && id !== null && id.id ? id.id : id;

  if (!taskId || !mongoose.Types.ObjectId.isValid(String(taskId))) {
    throw new Error("Invalid task id");
  }

  const updated = await Task.findByIdAndUpdate(String(taskId), updateData, {
    new: true,
  });
  return updated;
};

export const deleteTask = async (id) => {
  const deleteTask = await Task.findByIdAndDelete(id);
  return deleteTask;
};
