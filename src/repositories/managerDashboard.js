// repositories/managerDashboardRepository.js

import Land from "../models/land.js";
import User from "../models/user.js";
import Task from "../models/task.js";
import Process from "../models/process.js";
import Bill from "../models/bill.js"; // rename if your payments model is different
import Role from "../models/role.js";

/**
 * Manager dashboard repository
 * - Returns counts and recent lists for a given division
 * - Mirrors style of fieldOfficer repository (small focused functions)
 */

export const managerDashboardRepository = {
  // Total lands in this division
  async countTotalLandsByDivision(divisionId) {
    const count = await Land.countDocuments({ division: divisionId });
    console.log("Total lands (division):", count);
    return count;
  },

  // Total field officers assigned to this division
  async countFieldOfficersByDivision(divisionId) {
    // If users store division reference directly:
    // try to resolve Role ObjectId for "FieldOfficer" if roles are referenced
    const fieldOfficerRole = await Role.findOne({ name: "FieldOfficer" });

    let filter = {};
    if (fieldOfficerRole) {
      filter = { role: fieldOfficerRole._id, "division._id": divisionId };
      // also try alternative shapes
      const count = await User.countDocuments(filter);
      console.log("Field officers count (division):", count);
      return count;
    }

    // fallback if role is stored as embedded object { name: 'FieldOfficer' }
    const countFallback = await User.countDocuments({ "role.name": "FieldOfficer", "division._id": divisionId });
    console.log("Field officers count (division) fallback:", countFallback);
    return countFallback;
  },

  // Pending operations count (tasks with status 'pending' in this division)
  async countPendingOperationsByDivision(divisionId) {
    // If Task stores division directly
    let count = await Task.countDocuments({ division: divisionId, status: "pending" });

    // Fallback: Task -> Process -> Land -> Division chain
    if (typeof count === "number" && count === 0) {
      const landIds = await Land.find({ division: divisionId }).distinct("_id");
      if (landIds.length > 0) {
        const processIds = await Process.find({ landID: { $in: landIds } }).distinct("_id");
        count = await Task.countDocuments({ processID: { $in: processIds }, status: "pending" });
      }
    }

    console.log("Pending operations (division):", count);
    return count;
  },

  // Pending bills/payments count in this division
  async countPendingBillsByDivision(divisionId) {
    // try Bill having division embedded
    let count = await Bill.countDocuments({ "division._id": divisionId, status: "pending" });

    // fallback: bills associated with land -> division
    if (typeof count === "number" && count === 0) {
      const landIds = await Land.find({ division: divisionId }).distinct("_id");
      if (landIds.length > 0) {
        count = await Bill.countDocuments({ land: { $in: landIds }, status: "pending" });
      }
    }

    console.log("Pending bills (division):", count);
    return count;
  },

  // Recent task requests for this division (populated)
  async getRecentRequestsByDivision(divisionId, limit = 6) {
    // simple path: Task has division
    let tasks = await Task.find({ division: divisionId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({ path: "assignedTo", select: "_id fullName name" })
      .populate({
        path: "processID",
        populate: [{ path: "landID", select: "_id title" }, { path: "landId", select: "_id title" }],
      })
      .lean();

    // fallback: Task -> Process -> Land -> Division
    if (!tasks || tasks.length === 0) {
      const landIds = await Land.find({ division: divisionId }).distinct("_id");
      if (landIds.length > 0) {
        const processIds = await Process.find({ landID: { $in: landIds } }).distinct("_id");
        tasks = await Task.find({ processID: { $in: processIds } })
          .sort({ createdAt: -1 })
          .limit(limit)
          .populate({ path: "assignedTo", select: "_id fullName name" })
          .populate({
            path: "processID",
            populate: [{ path: "landID", select: "_id title" }, { path: "landId", select: "_id title" }],
          })
          .lean();
      }
    }

    return tasks || [];
  },

  // Recent payments (Bills) in this division
  async getRecentPaymentsByDivision(divisionId, limit = 6) {
    let payments = await Bill.find({ "division._id": divisionId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({ path: "payer", select: "_id fullName name" })
      .lean();

    // fallback: bills by land
    if (!payments || payments.length === 0) {
      const landIds = await Land.find({ division: divisionId }).distinct("_id");
      if (landIds.length > 0) {
        payments = await Bill.find({ land: { $in: landIds } })
          .sort({ createdAt: -1 })
          .limit(limit)
          .populate({ path: "payer", select: "_id fullName name" })
          .lean();
      }
    }

    return payments || [];
  },

  // Combined overview + recent data (main entry used by controller)
  async getOverviewAndRecent(divisionId, options = { recentLimit: 6 }) {
    const { recentLimit } = options;

    const [totalLands, totalFieldOfficers, pendingOperations, pendingBills, recentRequests, recentPayments] =
      await Promise.all([
        this.countTotalLandsByDivision(divisionId),
        this.countFieldOfficersByDivision(divisionId),
        this.countPendingOperationsByDivision(divisionId),
        this.countPendingBillsByDivision(divisionId),
        this.getRecentRequestsByDivision(divisionId, recentLimit),
        this.getRecentPaymentsByDivision(divisionId, recentLimit),
      ]);

    return {
      totalLands,
      totalFieldOfficers,
      pendingOperations,
      pendingBills,
      recentRequests,
      recentPayments,
    };
  },
};

export default {
  managerDashboardRepository,
};
