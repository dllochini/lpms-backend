import Land from "../models/land.js";
import Role from "../models/role.js";
import User from "../models/user.js";
import Task from "../models/task.js";
import Bill from "../models/bill.js";
import Process from "../models/process.js";

export const managerDashboardRepository = {
  async countLandsByDivision(divisionId) {
    const count = await Land.countDocuments({ division: divisionId });
    console.log("land count", count);
    return count;
  },

  //   async getFieldOfficersByDivision(divisionId) {
  //     const fieldRole = await Role.findOne({ name: "Field Officer" });
  //     if (!fieldRole) return [];
  //     return User.find({ division: divisionId, role: fieldRole._id }).select(
  //       "fullName email contact_no"
  //     );
  //   },

  async countPendingOperations(divisionId) {
    // Step 1: find all lands in the division
    const landIds = await Land.find({ division: divisionId }).distinct("_id");

    console.log("Lands", landIds);

    // Step 2: find processes belonging to those lands
    const processIds = await Process.find({
      landID: { $in: landIds },
    }).distinct("_id");

    console.log("Processes", processIds);

    // Step 3: count tasks linked to those processes and awaiting approval
    const count = await Task.countDocuments({
      processID: { $in: processIds },
      status: "sent for approval",
    });

    console.log("pending ops count", count);
    return count;
  },

  async countPendingBills(divisionId) {
    // Step 1: find all lands in the division
    const landIds = await Land.find({ division: divisionId }).distinct("_id");

    // Step 2: find processes belonging to those lands
    const processIds = await Process.find({
      landId: { $in: landIds },
    }).distinct("_id");

    // Step 3: count bills linked to those processes and with Pending status
    const count = await Bill.countDocuments({
      processID: { $in: processIds },
      status: "sent for approval",
    });

    console.log("pending bills count", count);
    return count;
  },

  async countFieldOfficersByDivision(divisionId) {
    try {
      const fieldOfficerRole = await Role.findOne({ name: "Field Officer" });
      if (!fieldOfficerRole) return 0;

      console.log("id:", fieldOfficerRole._id);

      const count = await User.countDocuments({
        role: fieldOfficerRole._id,
        division: divisionId,
      });
      console.log("field offcer count:", count);
      return count;
    } catch (err) {
      console.error("Error counting field officers:", err);
      return 0;
    }
  },

  // NEW: Get array of pending operations (Tasks)
  async getPendingOperationsByDivision(divisionId) {
    const landIds = await Land.find({ division: divisionId }).distinct("_id");
    const processIds = await Process.find({
      landID: { $in: landIds },
    }).distinct("_id");

    const tasks = await Task.find({
      processID: { $in: processIds },
      status: "sent for approval",
    })
      .populate("processID", "landID").populate("assignedTo","fullName") // optional, include related process/land info
      .lean();

    return tasks; // array of task objects
  },

  // NEW: Get array of pending bills (Bills)
  async getPendingBillsByDivision(divisionId) {
    const landIds = await Land.find({ division: divisionId }).distinct("_id");
    const processIds = await Process.find({
      landId: { $in: landIds },
    }).distinct("_id");

    const bills = await Bill.find({
      processID: { $in: processIds },
      status: "sent for approval",
    })
      .populate("processID", "landID") // optional
      .lean();

    return bills; // array of bill objects
  },
};

export default {
  managerDashboardRepository,
};
