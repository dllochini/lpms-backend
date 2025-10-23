// repositories/higherManagerDashboard.js

import Land from "../models/land.js";
import Division from "../models/division.js";
import Task from "../models/task.js";
import Process from "../models/process.js";
import User from "../models/user.js"; // to find lands under manager

export const higherManagerDashboardRepository = {
  // Helper to get land IDs: either single landId or all lands for manager
  async getLandIds({ landId, managerId }) {
    if (landId) return [landId];

    if (managerId) {
      // Assuming Land has a 'manager' field referencing the higher manager
      const lands = await Land.find({ manager: managerId }).distinct("_id");
      return lands;
    }

    return [];
  },

  async countTotalLands({ landId, managerId }) {
    const landIds = await this.getLandIds({ landId, managerId });
    const count = await Land.countDocuments({ _id: { $in: landIds } });
    console.log("Total lands:", count);
    return count;
  },

  async calculateTotalArea({ landId, managerId }) {
    const landIds = await this.getLandIds({ landId, managerId });
    const result = await Land.aggregate([
      { $match: { _id: { $in: landIds } } },
      { $group: { _id: null, totalArea: { $sum: "$area" } } },
    ]);
    const totalArea = result.length ? result[0].totalArea : 0;
    console.log("Total area:", totalArea);
    return totalArea;
  },

  async countDivisions({ landId, managerId }) {
    const landIds = await this.getLandIds({ landId, managerId });
    const divisionIds = await Land.find({ _id: { $in: landIds } }).distinct("division");
    const count = divisionIds.length;
    console.log("Divisions count:", count);
    return count || 1;
  },

  async countLandsInProgress({ landId, managerId }) {
    const landIds = await this.getLandIds({ landId, managerId });
    if (landIds.length === 0) return 0;

    const processIds = await Process.find({ landID: { $in: landIds } }).distinct("_id");
    if (processIds.length === 0) return 0;

    const count = await Task.countDocuments({
      processID: { $in: processIds },
      status: "in progress",
    });

    console.log("Lands in progress:", count);
    return count;
  },

  async getGraphData({ landId, managerId }) {
    const landIds = await this.getLandIds({ landId, managerId });

    const graphData = await Land.aggregate([
      { $match: { _id: { $in: landIds } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const formatted = graphData.map((g) => ({
      month: monthNames[g._id - 1],
      count: g.count,
    }));

    console.log("Graph data:", formatted);
    return formatted;
  },

  async getCoverageData({ landId, managerId }) {
    const landIds = await this.getLandIds({ landId, managerId });

    const coverageData = await Land.aggregate([
      { $match: { _id: { $in: landIds } } },
      {
        $group: {
          _id: "$division", // group by division name/id
          area: { $sum: "$area" },
        },
      },
      { $sort: { area: -1 } },
    ]);

    const formatted = coverageData.map((c) => ({
      division: c._id,
      area: c.area,
    }));

    console.log("Coverage data:", formatted);
    return formatted;
  },
};
