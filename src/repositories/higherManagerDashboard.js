// repositories/higherManagerDashboard.js
import mongoose from "mongoose";
import Land from "../models/land.js";
import Task from "../models/task.js";
import Process from "../models/process.js";
import Bill from "../models/bill.js"; // used for recent payments
// If you have an Operation model, swap Process/Operation usage as appropriate.

const toObjectId = (id) => {
  if (!id) return null;
  return mongoose.Types.ObjectId.isValid(id) ? mongoose.Types.ObjectId(id) : null;
};

const STATUS_PENDING = ["pending", "todo", "not started"];
const STATUS_IN_PROGRESS = ["in progress", "in-progress", "ongoing", "started", "active"];
const STATUS_COMPLETED = ["completed", "done", "finished"];

export const higherManagerDashboardRepository = {
  // --- Get land IDs for a division or all lands
  async getLandIds({ divisionId } = {}) {
    if (!divisionId) {
      return await Land.find({}).distinct("_id").exec();
    }

    const oid = toObjectId(divisionId);
    // If valid ObjectId, match by ObjectId. If not, attempt to match by whatever is stored in `division` field.
    const match = oid ? { division: oid } : { division: divisionId };
    return await Land.find(match).distinct("_id").exec();
  },

  // --- Dashboard cards: total lands, total area, divisions, lands in progress
  async getOverview({ divisionId } = {}) {
    const landIds = await this.getLandIds({ divisionId });
    const totalLands = landIds.length;

    // Sum area (handle both 'area' or 'size' fields and string numbers)
    const totalAreaAgg = await Land.aggregate([
      { $match: { _id: { $in: landIds } } },
      {
        $project: {
          areaNum: {
            $toDouble: { $ifNull: ["$area", "$size", 0] }
          }
        }
      },
      { $group: { _id: null, totalArea: { $sum: "$areaNum" } } }
    ]).exec();

    const totalArea = totalAreaAgg[0]?.totalArea || 0;

    // Count distinct divisions represented in these lands
    const divisionsCount = await Land.find({ _id: { $in: landIds } }).distinct("division").exec();

    const landsInProgress = await this.countLandsInProgress({ landIds });

    return {
      totalLands,
      totalArea,
      divisions: divisionsCount.length,
      landsInProgress,
    };
  },

  // --- Count lands with at least one task in progress
  async countLandsInProgress({ landIds } = {}) {
    if (!Array.isArray(landIds) || landIds.length === 0) return 0;

    // Find processes that belong to these lands
    const processIds = await Process.find({ land: { $in: landIds } }).distinct("_id").exec();
    if (!processIds.length) return 0;

    // Tasks may reference the process using various field names: 'process', 'processId', 'processID'
    const tasks = await Task.find({
      $or: [
        { process: { $in: processIds } },
        { processId: { $in: processIds } },
        { processID: { $in: processIds } }
      ],
      status: { $in: STATUS_IN_PROGRESS }
    }).select(["process", "processId", "processID"]).lean().exec();

    if (!tasks.length) return 0;

    // collect used process ids from the task records (account for various field names)
    const usedProcessIds = new Set();
    for (const t of tasks) {
      if (t.process) usedProcessIds.add(String(t.process));
      else if (t.processId) usedProcessIds.add(String(t.processId));
      else if (t.processID) usedProcessIds.add(String(t.processID));
    }

    if (!usedProcessIds.size) return 0;

    // Find processes -> lands
    const processes = await Process.find({ _id: { $in: Array.from(usedProcessIds) } }).select("land").lean().exec();
    const landIdsInProgress = new Set(processes.map(p => String(p.land)));
    return landIdsInProgress.size;
  },

  // --- Land overview graph (monthly land registrations)
  async getGraphData({ divisionId } = {}) {
    const landIds = await this.getLandIds({ divisionId });

    if (!landIds.length) {
      // return zeroed months
      const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return monthNames.map((m) => ({ month: m, count: 0 }));
    }

    const raw = await Land.aggregate([
      { $match: { _id: { $in: landIds } } },
      { $project: { month: { $month: { $ifNull: ["$createdAt", new Date()] } } } },
      { $group: { _id: "$month", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).exec();

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const byMonth = new Map(raw.map(r => [Number(r._id), r.count]));
    return monthNames.map((name, idx) => ({ month: name, count: byMonth.get(idx + 1) ?? 0 }));
  },

  // --- Land coverage graph (area per division)
  async getCoverageData({ divisionId } = {}) {
    const landIds = await this.getLandIds({ divisionId });

    if (!landIds.length) return [];

    // Sum area per division, using fallback to size if area is absent
    const coverage = await Land.aggregate([
      { $match: { _id: { $in: landIds } } },
      {
        $project: {
          division: 1,
          areaNum: { $toDouble: { $ifNull: ["$area", "$size", 0] } }
        }
      },
      { $group: { _id: "$division", area: { $sum: "$areaNum" } } },
      { $sort: { area: -1 } }
    ]).exec();

    return coverage.map(c => ({ divisionId: c._id ?? null, area: c.area }));
  },

  // --- Combined dashboard for frontend (cards)
  async getHigherManagerDashboardCardInfo({ divisionId } = {}) {
    const [overview, graph, coverage] = await Promise.all([
      this.getOverview({ divisionId }),
      this.getGraphData({ divisionId }),
      this.getCoverageData({ divisionId }),
    ]);

    return { overview, graph, coverage };
  },

  // --- Recent operations (using Process as 'operation' here)
  async getRecentOperations({ divisionId } = {}, limit = 6) {
    const landIds = await this.getLandIds({ divisionId });
    const match = landIds.length ? { land: { $in: landIds } } : {};
    const ops = await Process.find(match).sort({ startDate: -1 }).limit(limit).lean().exec();
    return ops;
  },

  // --- Recent payments (assumes a Bill model)
  async getRecentPayments({ divisionId } = {}, limit = 6) {
    // If bills are linked to lands/processes with a land or division ref, adapt this query.
    // Here we just return recent bills (you can filter by division if bill has that field).
    const bills = await Bill.find({}).sort({ createdAt: -1 }).limit(limit).lean().exec();
    return bills;
  },

  // --- Progress summary (counts tasks by status for given division)
  async getProgress({ divisionId } = {}) {
    const landIds = await this.getLandIds({ divisionId });
    if (!landIds.length) return { pending: 0, inProgress: 0, completed: 0 };

    // get process ids for these lands
    const processIds = await Process.find({ land: { $in: landIds } }).distinct("_id").exec();
    if (!processIds.length) return { pending: 0, inProgress: 0, completed: 0 };

    // count tasks by status (considering multiple possible process reference fields)
    const match = {
      $and: [
        {
          $or: [
            { process: { $in: processIds } },
            { processId: { $in: processIds } },
            { processID: { $in: processIds } }
          ]
        }
      ]
    };

    const pipeline = [
      { $match: match },
      {
        $project: {
          normalizedStatus: {
            $toLower: { $ifNull: ["$status", ""] }
          }
        }
      },
      {
        $group: {
          _id: "$normalizedStatus",
          count: { $sum: 1 }
        }
      }
    ];

    const rawCounts = await Task.aggregate(pipeline).exec();
    let pending = 0, inProgress = 0, completed = 0;
    for (const r of rawCounts) {
      const st = String(r._id || "").trim();
      if (STATUS_COMPLETED.includes(st)) completed += r.count;
      else if (STATUS_IN_PROGRESS.includes(st)) inProgress += r.count;
      else if (STATUS_PENDING.includes(st)) pending += r.count;
      else {
        // unknown status → treat as pending by default
        pending += r.count;
      }
    }

    return { pending, inProgress, completed };
  }
};

export default higherManagerDashboardRepository;
