// repositories/fieldOfficerDashboard.js

import Land from "../models/land.js";
import User from "../models/user.js";
import Task from "../models/task.js";
import Process from "../models/process.js";

export const fieldOfficerDashboardRepository = {
  // Count lands assigned to this officer
  async countAssignedLands(landId) {
    const count = await Land.countDocuments({ assignedTo: landId });
    console.log("Assigned lands count:", count);
    return count;
  },

  // Count farmers associated with the officer’s lands
  async countFarmers(landId) {
    const landIds = await Land.find({ assignedTo: landId }).distinct("_id");
    const count = await User.countDocuments({ land: { $in: landIds }, role: "Farmer" });
    console.log("Farmers count:", count);
    return count;
  },

  // Count lands in progress
  async countLandsInProgress(landId) {
    const landIds = await Land.find({ assignedTo: landId }).distinct("_id");
    const processIds = await Process.find({ landID: { $in: landIds } }).distinct("_id");
    const count = await Task.countDocuments({ processID: { $in: processIds }, status: "in progress" });
    console.log("Lands in progress:", count);
    return count;
  },

  // NEW: Overall progress for assigned lands (Pending, In Progress, Completed)
  async getProgress(landId) {
    const landIds = await Land.find({ assignedTo: landId }).distinct("_id");
    const processIds = await Process.find({ landID: { $in: landIds } }).distinct("_id");

    const totalTasks = await Task.countDocuments({ processID: { $in: processIds } });
    const pending = await Task.countDocuments({ processID: { $in: processIds }, status: "pending" });
    const inProgress = await Task.countDocuments({ processID: { $in: processIds }, status: "in progress" });
    const completed = await Task.countDocuments({ processID: { $in: processIds }, status: "completed" });

    const pendingPercent = totalTasks ? Math.round((pending / totalTasks) * 100) : 0;
    const inProgressPercent = totalTasks ? Math.round((inProgress / totalTasks) * 100) : 0;
    const completedPercent = totalTasks ? Math.round((completed / totalTasks) * 100) : 0;

    return {
      pending: pendingPercent,
      inProgress: inProgressPercent,
      completed: completedPercent
    };
  }
};

export default {
  fieldOfficerDashboardRepository
};
