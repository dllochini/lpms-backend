import Process from "../models/process.js";
import Task from "../models/task.js";
import WorkDone from "../models/workDone.js";

export const getProcessByLandId = async (landId) => {
  try {
    const processes = await Process.find({ land: landId })
      .select("_id startedDate endDate status land")
      .lean();

    if (!processes.length) return [];

    const processIds = processes.map(p => p._id);

    // all tasks for these processes
    const tasks = await Task.find({ process: { $in: processIds } })
      .populate("operation")
      .populate({
        path: "resource",
        populate: { path: "unit" },
      })
      .lean();

    const taskIds = tasks.map(t => t._id);
    if (taskIds.length === 0) {
      return processes.map(p => ({ ...p, tasks: [] }));
    }

    // all workDones for these tasks
    const workDones = await WorkDone.find({ task: { $in: taskIds } })
      .select("_id task startDate endDate newWork notes")
      .lean();

    // map workDones by taskId
    const workDonesByTask = workDones.reduce((acc, wd) => {
      const k = wd.task.toString();
      if (!acc[k]) acc[k] = [];
      acc[k].push(wd);
      return acc;
    }, {});

    // attach workDones to tasks
    const tasksByProcess = tasks.reduce((acc, t) => {
      const withWork = { ...t, workDones: workDonesByTask[t._id.toString()] || [] };
      const pid = t.process.toString();
      if (!acc[pid]) acc[pid] = [];
      acc[pid].push(withWork);
      return acc;
    }, {});

    // attach tasks to processes
    const result = processes.map(p => ({ ...p, tasks: tasksByProcess[p._id.toString()] || [] }));
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default {
    getProcessByLandId,
}
