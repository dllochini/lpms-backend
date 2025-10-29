


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
  return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
}

// Get all land IDs for a division
async function getLandIdsForDivision(divisionId) {
  const maybeId = toObjectIdMaybe(divisionId);
  if (!maybeId) return [];

  const landIds = await Land.find({
    $or: [{ division: maybeId }, { "division._id": maybeId }],
  }).distinct("_id");

  console.log("DEBUG: getLandIdsForDivision ->", { divisionId, landCount: landIds.length });
  return landIds;
}

// Get all process IDs for a division (via land or division)
async function getProcessIdsForDivision(divisionId, landIds = []) {
  const maybeId = toObjectIdMaybe(divisionId);

  const orConditions = [
    { division: maybeId },
    { "division._id": maybeId },
    ...(landIds.length > 0 ? [{ land: { $in: landIds } }] : []),
  ];

  const processIds = await Process.find({ $or: orConditions }).distinct("_id");
  console.log("DEBUG: getProcessIdsForDivision ->", { divisionId, processCount: processIds.length });
  return processIds;
}

// Manager Dashboard Repository
export const managerDashboardRepository = {
  async countTotalLandsByDivision(divisionId) {
    const maybeId = toObjectIdMaybe(divisionId);
    if (!maybeId) return 0;

    const count = await Land.countDocuments({
      $or: [{ division: maybeId }, { "division._id": maybeId }],
    });
    console.log("Total lands (division):", count);
    return count;
  },

  async countFieldOfficersByDivision(divisionId) {
    const maybeId = toObjectIdMaybe(divisionId);
    if (!maybeId) return 0;

    const role = await Role.findOne({ name: "Field Officer" });
    if (!role) return 0;

    const count = await User.countDocuments({
      role: role._id,
      $or: [{ division: maybeId }, { "division._id": maybeId }],
    });
    console.log("Field officers count (division):", count);
    return count;
  },

  async countPendingOperationsByDivision(divisionId) {
    const maybeId = toObjectIdMaybe(divisionId);
    if (!maybeId) return 0;

    const landIds = await getLandIdsForDivision(divisionId);
    const processIds = await getProcessIdsForDivision(divisionId, landIds);

    let count = await Task.countDocuments({
      $or: [
        { division: maybeId },
        { "division._id": maybeId },
        ...(processIds.length > 0 ? [{ process: { $in: processIds } }] : []),
      ],
      status: "In Progress",
    });

    console.log("Pending operations (division):", count);
    return count;
  },

  // ✅ Updated pending payments
  async countPendingBillsByDivision(divisionId) {
    const maybeId = toObjectIdMaybe(divisionId);
    if (!maybeId) return 0;

    const landIds = await getLandIdsForDivision(divisionId);
    const processIds = await getProcessIdsForDivision(divisionId, landIds);

    const query = {
      status: "pending",
      $or: [
        { division: maybeId },
        { "division._id": maybeId },
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
      divisionId,
      landIdsCount: landIds.length,
      processIdsCount: processIds.length,
      billIdsCount: billIds.length,
    });

    return billIds.length;
  },

  async  getRecentRequestsByDivision(divisionId, limit = 6) {
    const maybeId = mongoose.Types.ObjectId.isValid(divisionId)
      ? new mongoose.Types.ObjectId(divisionId)
      : null;
    if (!maybeId) return [];
  
    const tasks = await Task.aggregate([
      { $match: { status: "Send for Approval" } },
      {
        $lookup: {
          from: "processes",
          localField: "process",
          foreignField: "_id",
          as: "process",
        },
      },
      { $unwind: "$process" },
      {
        $lookup: {
          from: "lands",
          localField: "process.land",
          foreignField: "_id",
          as: "land",
        },
      },
      { $unwind: "$land" },
      { $match: { "land.division": maybeId } },
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "assignedTo",
        },
      },
      { $unwind: "$assignedTo" },
      { $sort: { createdAt: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          status: 1,
          createdAt: 1,
          assignedTo: { _id: 1, fullName: 1, name: 1 },
          process: 1,
        },
      },
    ]);
  
    return tasks;
  },
  
  

 
  
  // Get recent payments by division with payer populated
  async getRecentPaymentsByDivision(divisionId, limit = 6) {
    const maybeId = toObjectIdMaybe(divisionId);
    if (!maybeId) return [];
  
    const landIds = await getLandIdsForDivision(divisionId);
    const processIds = await getProcessIdsForDivision(divisionId, landIds);
  
    const orConditions = [
      { division: maybeId },
      { "division._id": maybeId },
      ...(landIds.length > 0 ? [{ land: { $in: landIds } }] : []),
      ...(processIds.length > 0
        ? [
            { process: { $in: processIds } },
            { processId: { $in: processIds } },
            { process_id: { $in: processIds } },
          ]
        : []),
    ];
  
    const payments = await Bill.find({ $or: orConditions, status: "pending" })
      .sort({ created_at: -1 })
      .limit(limit)
      .populate({ path: "payer", select: "_id fullName name" }) // ✅ populate payer
      .lean();
      console.log("DEBUG payments:", payments);
      
    return payments;
  
  },

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
