import mongoose from "mongoose";
import Land from "../models/land.js";
import User from "../models/user.js";
import Task from "../models/task.js";
import Process from "../models/process.js";
import Role from "../models/role.js";

export const fieldOfficerDashboardRepository = {
  async countAssignedLandsByDivision(divisionId) {
    const count = await Land.countDocuments({ division: divisionId });
    // console.log("Assigned lands count (division):", count);
    return count;
  },

  async countFarmersByDivision(divisionId) {
    const lands = await Land.find({ division: divisionId }).select("farmer");
    const farmerIds = lands.map((l) => l.farmer).filter((f) => f);

    if (farmerIds.length === 0) return 0;

    const farmerRole = await Role.findOne({ name: "Farmer" });
    if (!farmerRole) return 0;

    const count = await User.countDocuments({
      _id: { $in: farmerIds },
      role: farmerRole._id,
    });

    // console.log("Farmers count (division):", count);
    return count;
  },

  async countLandsInProgressByDivision(divisionId) {
    const landIds = await Land.find({ division: divisionId }).distinct("_id");

    const landsInProgress = await Process.find({
      land: { $in: landIds },
      status: "In Progress",
    }).distinct("land");

    // console.log("Lands in progress (division):", landsInProgress.length);
    return landsInProgress.length;
  },

  async getOverallProgressByDivision(divisionId) {
    if (!mongoose.Types.ObjectId.isValid(divisionId)) {
      return { pending: 0, inProgress: 0, completed: 0 };
    }

    const landIds = await Land.find({ division: divisionId }).distinct("_id");
    if (landIds.length === 0)
      return { pending: 0, inProgress: 0, completed: 0 };

    const processIds = await Process.find({ land: { $in: landIds } }).distinct(
      "_id"
    );
    if (processIds.length === 0)
      return { pending: 0, inProgress: 0, completed: 0 };

    const totalTasks = await Task.countDocuments({
      process: { $in: processIds },
    });
    if (totalTasks === 0) return { pending: 0, inProgress: 0, completed: 0 };

    const pendingTasks = await Task.countDocuments({
      process: { $in: processIds },
      status: { $regex: /pending/i },
    });

    const inProgressTasks = await Task.countDocuments({
      process: { $in: processIds },
      status: { $regex: /in progress/i },
    });

    const completedTasks = await Task.countDocuments({
      process: { $in: processIds },
      status: { $regex: /approved/i },
    });

    return {
      pending: Math.round((pendingTasks / totalTasks) * 100),
      inProgress: Math.round((inProgressTasks / totalTasks) * 100),
      completed: Math.round((completedTasks / totalTasks) * 100),
    };
  },

  async getRecentOperationsByDivision(divisionId, limit = 5) {
    const landIds = await Land.find({ division: divisionId }).distinct("_id");
    const processIds = await Process.find({ land: { $in: landIds } }).distinct(
      "_id"
    );

    const tasks = await Task.find({ process: { $in: processIds } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("_id name startDate");

    return tasks.map((task) => ({
      id: task._id,
      title: task.name,
      time: task.startDate ? task.startDate.toLocaleString() : "-",
    }));
  },

  async getRecentPaymentsByDivision(divisionId, limit = 5) {
    const landIds = await Land.find({ division: divisionId }).distinct("_id");
    const processIds = await Process.find({ land: { $in: landIds } }).distinct(
      "_id"
    );

    const payments = await Task.find({
      process: { $in: processIds },
      status: "paid",
    })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .select("_id name updatedAt");

    return payments.map((pay) => ({
      id: pay._id,
      title: pay.name || "Payment",
      time: pay.updatedAt ? pay.updatedAt.toLocaleString() : "-",
    }));
  },
};

export default {
  fieldOfficerDashboardRepository,
};
