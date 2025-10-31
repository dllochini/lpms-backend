import mongoose from "mongoose";
import Land from "../models/land.js";
import User from "../models/user.js";
import Task from "../models/task.js";
import Process from "../models/process.js";
import Bill from "../models/bill.js";
import Role from "../models/role.js";

// Convert to ObjectId safely
function toObjectIdMaybe(id) {
  if (!id) return null;
  if (id instanceof mongoose.Types.ObjectId) return id;
  return mongoose.Types.ObjectId.isValid(id)
    ? new mongoose.Types.ObjectId(id)
    : null;
}

// Get all land IDs for a division
async function getLandIdsForDivision(divisionId) {

  const landIds = await Land.find({
    $or: [{ division: divisionId }, { "division._id": divisionId }],
  }).distinct("_id");

  console.log("DEBUG: getLandIdsForDivision ->", { divisionId, landCount: landIds.length, });
  
  return landIds;
}

// Get all process IDs for a division (via land or division)
async function getProcessIdsForDivision(divisionId, landIds = []) {

  const orConditions = [
    { division: divisionId },
    { "division._id": divisionId },
    ...(landIds.length > 0 ? [{ land: { $in: landIds } }] : []),
  ];

  const processIds = await Process.find({ $or: orConditions }).distinct("_id");
  console.log("hellpDEBUG: getProcessIdsForDivision ->", {
    divisionId,
    processCount: processIds.length,
  });
  return processIds;
}

// Manager Dashboard Repository
export const managerDashboardRepository = {
  //Total Registered Lands Card
  async countTotalLandsByDivision(divisionId) {
    // const divisionId = toObjectIdMaybe(divisionId);
    // if (!divisionId) return 0;

    const count = await Land.countDocuments({
      $or: [{ division: divisionId }, { "division._id": divisionId }],
    });
    // console.log("Total lands (division):", count); ok
    return count;
  },

  //Assigned field officers Card
  async countFieldOfficersByDivision(divisionId) {
    // const divisionId = toObjectIdMaybe(divisionId);
    // if (!divisionId) return 0;

    const role = await Role.findOne({ name: "Field Officer" });
    if (!role) return 0;

    const count = await User.countDocuments({
      role: role._id,
      $or: [{ division: divisionId }, { "division._id": divisionId }],
    });
    // console.log("Field officers count (division):", count); ok
    return count;
  },

  //Pending operations Card
  async countPendingOperationsByDivision(divisionId) {

  const landIds = await getLandIdsForDivision(divisionId);
  const processIds = await getProcessIdsForDivision(divisionId, landIds);

  // console.log(processIds,"show")

  if (!processIds.length) return 0;

  const count = await Task.countDocuments({
    status: "In Progress", //
    process: { $in: processIds }, // something wrong
  });

  console.log("Pending operations (division):", count);
  return count;
},

  //Pending payments Card
  async countPendingBillsByDivision(divisionId) {
    // const divisionId = toObjectIdMaybe(divisionId);
    // if (!divisionId) return 0;

    const landIds = await getLandIdsForDivision(divisionId);
    const processIds = await getProcessIdsForDivision(divisionId, landIds);

    const query = {
      status: "Sent for Manager Approval",
      $or: [
        { division: divisionId },
        { "division._id": divisionId },
        ...(landIds.length > 0 ? [{ land: { $in: landIds } }] : []),
        ...(processIds.length > 0
          ? [
              { process: { $in: processIds } },
              { processId: { $in: processIds } },
              { process_id: { $in: processIds } },
            ]
          : []),
      ],
    };

    const billIds = await Bill.distinct("_id", query);

    console.log("DEBUG: countPendingBillsByDivision ->", {
      // divisionId, ok
      // landIdsCount: landIds.length, ok
      // processIdsCount: processIds.length, ok
      billIdsCount: billIds.length,
    });

    return billIds.length;
  },
  
  //Recent Requests datagrid
  async getRecentRequestsByDivision(divisionId, limit = 6) {
    const landIds = await getLandIdsForDivision(divisionId);
    const processIds = await getProcessIdsForDivision(divisionId, landIds);

    if (!processIds.length) return [];

    const tasks = await Task.find({
      status: "Sent for approval",
      process: { $in: processIds },
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({ path: "assignedTo", select: "_id fullName name" }).populate({path:"operation",select:"name"})
      .populate({ path: "process" })
      .lean();

    console.log("DEBUG: recent requests count:", tasks.length);
    return tasks;
  },

  // Recent Payments datagrid
  async getRecentPaymentsByDivision(divisionId, limit = 6) {

    const landIds = await getLandIdsForDivision(divisionId);
    const processIds = await getProcessIdsForDivision(divisionId, landIds);

    const orConditions = [
      { division: divisionId },
      { "division._id": divisionId },
      ...(landIds.length > 0 ? [{ land: { $in: landIds } }] : []),
      ...(processIds.length > 0
        ? [
            { process: { $in: processIds } },
            { processId: { $in: processIds } },
            { process_id: { $in: processIds } },
          ]
        : []),
    ];

    const payments = await Bill.find({
      $or: orConditions,
      status: "Sent for Manager Approval",
    })
      .sort({ created_at: -1 })
      .limit(limit)
      .populate({
        path: "process",
        populate: { path: "land", populate: "createdBy" },
      })
      // .populate({ path: "payer", select: "_id fullName name" }) // ✅ populate payer
      .lean();
    console.log("DEBUG payments:", payments);

    return payments;
  },

  //main function
  async getOverviewAndRecent(divisionId, options = { recentLimit: 6 }) {


    const { recentLimit } = options;
    console.log("options", divisionId, recentLimit)

    const maybeId = toObjectIdMaybe(divisionId);
    if (!maybeId) return [];

    const [
      totalLands,
      totalFieldOfficers,
      pendingOperations,
      pendingBills,
      recentRequests,
      recentPayments,
    ] = await Promise.all([
      this.countTotalLandsByDivision(maybeId),
      this.countFieldOfficersByDivision(maybeId),
      this.countPendingOperationsByDivision(maybeId),
      this.countPendingBillsByDivision(maybeId),
      this.getRecentRequestsByDivision(maybeId, recentLimit),
      this.getRecentPaymentsByDivision(maybeId, recentLimit),
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
