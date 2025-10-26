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
    // Get all farmers linked to lands in this division
    const lands = await Land.find({ division: divisionId }).select("farmer");
    const farmerIds = lands.map(l => l.farmer).filter(f => f);
  
    if (farmerIds.length === 0) return 0;
  
    // Get the Farmer role _id
    const farmerRole = await Role.findOne({ name: "Farmer" });
    if (!farmerRole) return 0;
  
    // Count users who are in farmerIds and have Farmer role
    const count = await User.countDocuments({
      _id: { $in: farmerIds },
      role: farmerRole._id
    });
  
    console.log("Farmers count (division):", count);
    return count;
  },
  
  
  
  
  

  // Count lands in progress in this division
  async countLandsInProgressByDivision(divisionId) {
    // Get all lands in the division
    const landIds = await Land.find({ division: divisionId }).distinct("_id");
  
    // Find lands that have at least one process with status "In Progress"
    const landsInProgress = await Process.find({
      land: { $in: landIds }, // use "land" instead of "landID"
      status: "In Progress"
    }).distinct("land"); // also use "land" here
  
    console.log("Lands in progress (division):", landsInProgress.length);
    return landsInProgress.length;
  },


  // Get overall task progress in this division
  async getOverallProgressByDivision(divisionId) {
    // Step 1: Get assigned lands
    const landIds = await Land.find({ division: divisionId, user: { $exists: true, $ne: null } }).distinct("_id");
  
    if (landIds.length === 0) return { pending: 0, inProgress: 0, completed: 0 };
  
    let pendingSum = 0;
    let inProgressSum = 0;
    let completedSum = 0;
  
    // Step 2: Loop over lands and calculate land-level task percentages
    for (const landId of landIds) {
      const processIds = await Process.find({ land: landId }).distinct("_id");
      const totalTasks = await Task.countDocuments({ process: { $in: processIds } });
  
      if (totalTasks === 0) continue;
  
      const pendingTasks = await Task.countDocuments({
        process: { $in: processIds },
        status: { $regex: /^pending$/i }
      });
      const inProgressTasks = await Task.countDocuments({
        process: { $in: processIds },
        status: { $regex: /^In Progress$/i }
      });
      const completedTasks = await Task.countDocuments({
        process: { $in: processIds },
        status: { $regex: /^Approved$/i }
      });
  
      pendingSum += (pendingTasks / totalTasks) * 100;
      inProgressSum += (inProgressTasks / totalTasks) * 100;
      completedSum += (completedTasks / totalTasks) * 100;
    }
  
    const landsCount = landIds.length;
  
    // Step 3: Average across all lands
    return {
      pending: Math.round(pendingSum / landsCount),
      inProgress: Math.round(inProgressSum / landsCount),
      completed: Math.round(completedSum / landsCount)
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
