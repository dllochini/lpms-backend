// repositories/fieldOfficerDashboard.js

import Land from "../models/land.js";
import User from "../models/user.js";
import Task from "../models/task.js";
import Process from "../models/process.js";
import Role from "../models/role.js"; // Import Role model to get ObjectId

export const fieldOfficerDashboardRepository = {
  // Count lands in this division
  async countAssignedLandsByDivision(divisionId) {
    const count = await Land.countDocuments({ division: divisionId });
    console.log("Assigned lands count (division):", count);
    return count;
  },

  // Count farmers in this division
  async countFarmersByDivision(divisionId) {
    const landIds = await Land.find({ division: divisionId }).distinct("_id");

    // Get ObjectId of the "Farmer" role
    const farmerRole = await Role.findOne({ name: "Farmer" });
    if (!farmerRole) return 0;

    const count = await User.countDocuments({
      land: { $in: landIds },
      role: farmerRole._id
    });
    console.log("Farmers count (division):", count);
    return count;
  },

  // Count lands in progress in this division
  async countLandsInProgressByDivision(divisionId) {
    const landIds = await Land.find({ division: divisionId }).distinct("_id");
    const processIds = await Process.find({ landID: { $in: landIds } }).distinct("_id");
    const count = await Task.countDocuments({ processID: { $in: processIds }, status: "in progress" });
    console.log("Lands in progress (division):", count);
    return count;
  },

  // Get overall task progress in this division
  async getProgressByDivision(divisionId) {
    const landIds = await Land.find({ division: divisionId }).distinct("_id");
    const processIds = await Process.find({ landID: { $in: landIds } }).distinct("_id");

    const totalTasks = await Task.countDocuments({ processID: { $in: processIds } });
    const pending = await Task.countDocuments({ processID: { $in: processIds }, status: "pending" });
    const inProgress = await Task.countDocuments({ processID: { $in: processIds }, status: "in progress" });
    const completed = await Task.countDocuments({ processID: { $in: processIds }, status: "completed" });

    return {
      pending: totalTasks ? Math.round((pending / totalTasks) * 100) : 0,
      inProgress: totalTasks ? Math.round((inProgress / totalTasks) * 100) : 0,
      completed: totalTasks ? Math.round((completed / totalTasks) * 100) : 0
    };
  },

  // Get recent operations in this division
  async getRecentOperationsByDivision(divisionId, limit = 5) {
    const landIds = await Land.find({ division: divisionId }).distinct("_id");
    const processIds = await Process.find({ landID: { $in: landIds } }).distinct("_id");
    const tasks = await Task.find({ processID: { $in: processIds } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("_id name startDate");

    return tasks.map(task => ({
      id: task._id,
      title: task.name,
      time: task.startDate ? task.startDate.toLocaleString() : "-"
    }));
  },

  // Get recent payments in this division
  async getRecentPaymentsByDivision(divisionId, limit = 5) {
    const landIds = await Land.find({ division: divisionId }).distinct("_id");
    const processIds = await Process.find({ landID: { $in: landIds } }).distinct("_id");

    // Adjust if you have a separate Payment model
    const payments = await Task.find({ processID: { $in: processIds }, status: "paid" })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .select("_id name updatedAt");

    return payments.map(pay => ({
      id: pay._id,
      title: pay.name || "Payment",
      time: pay.updatedAt ? pay.updatedAt.toLocaleString() : "-"
    }));
  }
};

export default {
  fieldOfficerDashboardRepository
};
