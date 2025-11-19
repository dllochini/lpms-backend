

// export default higherManagerDashboardRepository;

import mongoose from "mongoose";
import Land from "../models/land.js";
import Task from "../models/task.js";
import Process from "../models/process.js";
import Bill from "../models/bill.js";
import Division from "../models/division.js";

const toObjectId = (id) => {
  if (!id) return null;
  return mongoose.Types.ObjectId.isValid(id)
    ? mongoose.Types.ObjectId(id)
    : null;
};

const STATUS_PENDING = ["pending", "to do", "not started"];
const STATUS_IN_PROGRESS = [
  "in progress",
  "in-progress",
  "ongoing",
  "started",
  "active",
];
const STATUS_COMPLETED = ["completed", "approved", "finished"];

export const higherManagerDashboardRepository = {
  async getLandIds({ divisionId } = {}) {
    if (!divisionId) {
      return await Land.find({}).distinct("_id").exec();
    }

    const oid = toObjectId(divisionId);
    const match = oid ? { division: oid } : { division: divisionId };
    return await Land.find(match).distinct("_id").exec();
  },

  async getOverview({ divisionId } = {}) {
    const landIds = await this.getLandIds({ divisionId });
    const totalLands = landIds.length;

    const totalAreaAgg = await Land.aggregate([
      { $match: { _id: { $in: landIds } } },
      {
        $project: {
          areaNum: {
            $toDouble: { $ifNull: ["$area", "$size", 0] },
          },
        },
      },
      { $group: { _id: null, totalArea: { $sum: "$areaNum" } } },
    ]).exec();

    const totalArea = totalAreaAgg[0]?.totalArea || 0;

    const divisionsCount = await Land.find({ _id: { $in: landIds } })
      .distinct("division")
      .exec();

    const landsInProgress = await this.countLandsInProgress({ landIds });

    return {
      totalLands,
      totalArea,
      divisions: divisionsCount.length,
      landsInProgress,
    };
  },

  /**
   * FIX APPLIED HERE:
   * 1. Fetches the process documents themselves (including the land ID).
   * 2. Uses the fetched documents, now correctly named 'processes', in the return statement.
   */
  async getInProgressLandIds({ landIds } = {}) {
    if (!Array.isArray(landIds) || landIds.length === 0) return [];

    // 1. Fetch the process documents to get the land ID
    const processes = await Process.find({ land: { $in: landIds } })
      .select('_id land') // Select only what is needed: ID and associated land ID
      .lean()
      .exec();
      
    if (!processes.length) return [];

    // Extract process IDs for the next step (Task aggregation)
    const processIds = processes.map(p => p._id); 

    const tasks = await Task.aggregate([
      {
        $match: {
          $or: [
            { process: { $in: processIds } },
            { processId: { $in: processIds } },
            { processID: { $in: processIds } },
          ],
        },
      },
      {
        $project: {
          status: { $toLower: { $ifNull: ["$status", ""] } },
          processIdField: { $ifNull: ["$process", "$processId", "$processID"] },
        },
      },
      {
        $match: {
          status: { $in: STATUS_IN_PROGRESS },
        },
      },
    ]).exec();

    if (!tasks.length) return [];

    // 2. Determine which process IDs are actually 'in progress'
    const inProgressProcessIds = new Set(tasks.map((t) => String(t.processIdField)));
    if (!inProgressProcessIds.size) return [];

    // 3. Filter the original process list and map them to their land IDs
    return processes
      .filter(p => inProgressProcessIds.has(String(p._id)))
      .map((p) => p.land);
  },

  async countLandsInProgress({ landIds } = {}) {
    const inProgressIds = await this.getInProgressLandIds({ landIds });

    const landIdsInProgress = new Set(inProgressIds.map((p) => String(p)));
    return landIdsInProgress.size;
  },

  async getGraphData({ divisionId } = {}) {
    const landIds = await this.getLandIds({ divisionId });

    if (!landIds.length) {
      return [];
    }

    const divisionIds = await Land.find({ _id: { $in: landIds } })
      .distinct("division")
      .exec();
    if (!divisionIds.length) {
      return [];
    }

    const rawTotals = await Land.aggregate([
      { $match: { _id: { $in: landIds } } },
      { $group: { _id: "$division", total: { $sum: 1 } } },
    ]).exec();
    const totalsByDivision = new Map(
      rawTotals.map((r) => [String(r._id), r.total])
    );

    const inProgressLandIds = await this.getInProgressLandIds({ landIds });

    let inProgressByDivision = new Map();
    if (inProgressLandIds.length > 0) {
      const rawInProgress = await Land.aggregate([
        { $match: { _id: { $in: inProgressLandIds } } },
        { $group: { _id: "$division", inProgress: { $sum: 1 } } },
      ]).exec();
      inProgressByDivision = new Map(
        rawInProgress.map((r) => [String(r._id), r.inProgress])
      );
    }

    const divisions = await Division.find({ _id: { $in: divisionIds } })
      .select("name")
      .lean()
      .exec();

    return divisions.map((div) => ({
      name: div.name || "Unknown Division",
      "Total Lands": totalsByDivision.get(String(div._id)) ?? 0,
      "Lands In-progress": inProgressByDivision.get(String(div._id)) ?? 0,
    }));
  },

  async getCoverageData({ divisionId } = {}) {
    const landIds = await this.getLandIds({ divisionId });

    if (!landIds.length) return [];

    const coverage = await Land.aggregate([
      { $match: { _id: { $in: landIds } } },
      {
        $project: {
          division: 1,
          areaNum: { $toDouble: { $ifNull: ["$area", "$size", 0] } },
        },
      },
      { $group: { _id: "$division", area: { $sum: "$areaNum" } } },
      { $sort: { area: -1 } },
    ]).exec();

    return coverage.map((c) => ({ divisionId: c._id ?? null, area: c.area }));
  },

  async getRecentOperations({ divisionId } = {}, limit = 6) {
    const landIds = await this.getLandIds({ divisionId });
    const match = landIds.length ? { land: { $in: landIds } } : {};
    const ops = await Process.find(match)
      .sort({ startDate: -1 })
      .limit(limit)
      .lean()
      .exec();
    return ops;
  },

  async getRecentPayments({ divisionId } = {}, limit = 6) {
    const bills = await Bill.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();
    return bills;
  },

  async getProgress({ divisionId } = {}) {
    const landIds = await this.getLandIds({ divisionId });
    if (!landIds.length) return { pending: 0, inProgress: 0, completed: 0 };

    const processIds = await Process.find({ land: { $in: landIds } })
      .distinct("_id")
      .exec();
    if (!processIds.length) return { pending: 0, inProgress: 0, completed: 0 };

    const match = {
      $and: [
        {
          $or: [
            { process: { $in: processIds } },
            { processId: { $in: processIds } },
            { processID: { $in: processIds } },
          ],
        },
      ],
    };

    const pipeline = [
      { $match: match },
      {
        $project: {
          normalizedStatus: {
            $toLower: { $ifNull: ["$status", ""] },
          },
        },
      },
      {
        $group: {
          _id: "$normalizedStatus",
          count: { $sum: 1 },
        },
      },
    ];

    const rawCounts = await Task.aggregate(pipeline).exec();

    let pending = 0,
      inProgress = 0,
      completed = 0;
    for (const r of rawCounts) {
      const st = String(r._id || "").trim();
      if (STATUS_COMPLETED.includes(st)) completed += r.count;
      else if (STATUS_IN_PROGRESS.includes(st)) inProgress += r.count;
      else if (STATUS_PENDING.includes(st)) pending += r.count;
      else {
        pending += r.count;
      }
    }

    return { pending, inProgress, completed };
  },

  async getTaskStatsForLands(landIds) {
    if (!landIds || landIds.length === 0) {
      return { percentComplete: 0, overdueTasks: 0 };
    }
    
    // 1. Find processes for these lands
    const processIds = await Process.find({ land: { $in: landIds } }).distinct("_id").exec();
    if (!processIds.length) {
      return { percentComplete: 0, overdueTasks: 0 };
    }

    // 2. Use Aggregation to get all stats in one go
    const taskStatsAgg = await Task.aggregate([
      { $match: { 
          $or: [
            { process: { $in: processIds } },
            { processId: { $in: processIds } },
            { processID: { $in: processIds } }
          ]
      }},
      { $project: {
          status: { $toLower: { $ifNull: ["$status", ""] } },
          // NOTE: Assumes your Task model has an 'endDate' or 'dueDate' field.
          endDate: { $toDate: "$endDate" } 
      }},
      { $group: {
          _id: null, // Group all tasks for these lands together
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $in: ["$status", STATUS_COMPLETED] }, 1, 0] }
          },
          overdueTasks: {
            $sum: {
              $cond: [
                { $and: [
                    { $lt: ["$endDate", new Date()] }, // endDate is in the past
                    { $not: { $in: ["$status", STATUS_COMPLETED] } } // and task is not done
                ]}
              , 1, 0 ]
            }
          }
      }}
    ]);

    const stats = taskStatsAgg[0];

    // Handle no tasks found
    if (!stats || stats.totalTasks === 0) {
      return { percentComplete: 0, overdueTasks: 0 };
    }

    const percentComplete = Math.round((stats.completedTasks / stats.totalTasks) * 100);
    
    return {
      percentComplete: percentComplete,
      overdueTasks: stats.overdueTasks || 0
    };
  },

  async getDivisionPerformance() {
    // 1. Get all divisions that have lands
    const allLandIds = await this.getLandIds({});
    if (!allLandIds.length) return [];
    
    const divisionIds = await Land.find({ _id: { $in: allLandIds } }).distinct("division").exec();
    const divisions = await Division.find({ _id: { $in: divisionIds } }).select("name").lean().exec();

    if (!divisions.length) return [];

    // 2. Map over each division and fetch its stats
    const performanceData = await Promise.all(
      divisions.map(async (div) => {
        const divId = div._id;

        // Get land IDs for *this* division
        const landIds = await Land.find({ division: divId }).distinct("_id").exec();
        
        // Get lands in progress (reuse existing logic)
        const landsInProgress = await this.countLandsInProgress({ landIds });
        
        // Get task stats (use new helper)
        const { percentComplete, overdueTasks } = await this.getTaskStatsForLands(landIds);

        return {
          divisionName: div.name || "Unknown Division",
          landsInProgress: landsInProgress,
          percentComplete: percentComplete,
          overdueTasks: overdueTasks
        };
      })
    );

    return performanceData;
  },

  async getHigherManagerDashboardCardInfo({ divisionId } = {}) {
    const [overview, graph, progress, divisionPerformance] = await Promise.all([
      this.getOverview({ divisionId }),
      this.getGraphData({ divisionId }),
      this.getProgress({ divisionId }),
      this.getDivisionPerformance(),
    ]);

    return { overview, graph, progress, divisionPerformance };
  },
};

export default higherManagerDashboardRepository;