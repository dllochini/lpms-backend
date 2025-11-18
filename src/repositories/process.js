import mongoose from "mongoose";
import Process from "../models/process.js";
import Task from "../models/task.js";
import WorkDone from "../models/workDone.js";

export const getProcessByLandId = async (landId) => {
  try {
    const processes = await Process.find({ land: landId })
      .select("_id startedDate endDate status land")
      .lean();

    if (!processes.length) return [];

    const processIds = processes.map((p) => p._id);

    const tasks = await Task.find({ process: { $in: processIds } })
      .populate("operation")
      .populate({
        path: "resource",
        populate: { path: "unit" },
      })
      .lean();

    const taskIds = tasks.map((t) => t._id);
    if (taskIds.length === 0) {
      return processes.map((p) => ({ ...p, tasks: [] }));
    }

    const workDones = await WorkDone.find({ task: { $in: taskIds } })
      .select("_id task startDate endDate newWork notes")
      .lean();

    const workDonesByTask = workDones.reduce((acc, wd) => {
      const k = wd.task.toString();
      if (!acc[k]) acc[k] = [];
      acc[k].push(wd);
      return acc;
    }, {});

    const tasksByProcess = tasks.reduce((acc, t) => {
      const withWork = {
        ...t,
        workDones: workDonesByTask[t._id.toString()] || [],
      };
      const pid = t.process.toString();
      if (!acc[pid]) acc[pid] = [];
      acc[pid].push(withWork);
      return acc;
    }, {});

    const result = processes.map((p) => ({
      ...p,
      tasks: tasksByProcess[p._id.toString()] || [],
    }));
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateProcess = async (id, updateData) => {
  const processId = typeof id === "object" && id !== null && id.id ? id.id : id;

  if (!processId || !mongoose.Types.ObjectId.isValid(String(processId))) {
    throw new Error("Invalid task id");
  }

  const updated = await Process.findByIdAndUpdate(
    String(processId),
    updateData,
    { new: true }
  );
  return updated;
};

export const createProcess = async (processData) => {
  const process = new Process(processData);
  const newprocess = await process.save();
  return newprocess;
};

export const deleteProcess = async (id) => {
  // console.log("delete repo")
  const deleteProcess = await Process.findByIdAndDelete(id);
  // console.log(deleteProcess,"ok")
  return deleteProcess;
};

export default {
  getProcessByLandId,
  updateProcess,
  createProcess,
};
