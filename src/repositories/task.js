import mongoose from "mongoose";
import Task from "../models/task.js"; // Adjust the path if needed
import User from "../models/user.js";
import WorkDone from "../models/workDone.js"

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
      // no FOs -> no tasks
      return [];
    }

    // find tasks assigned to any of the FOs with the target status
    const tasks = await Task.find({
      assignedTo: { $in: fieldOfficerIds },
      status: "Sent for approval",
    })
      .populate({ path: "process", populate: { path: "land" } })
      .populate("operation")
      .populate("createdBy").populate({path:"resource", populate: {path: "unit"}})
      .lean();

    if (!tasks.length) {
      return [];
    }

    // collect task ids and fetch their workDones in one go
    const taskIds = tasks.map((t) => t._id);
    const workDones = await WorkDone.find({ task: { $in: taskIds } })
      .select("_id task startDate endDate newWork notes")
      .lean();

    // group workDones by task id (stringified)
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

// Get a Task by ID
export const getTaskById = async (id) => {
  const task = await Task.findById(id)
    .populate("process")
    .populate("operation");
  return task;
};

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

// Delete a Task by ID
export const deleteTask = async (id) => {
  const deleteTask = await Task.findByIdAndDelete(id);
  return deleteTask;
};
