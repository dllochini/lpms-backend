// repositories/higherManagerDashboard.js

import Land from "../models/land.js";
import Division from "../models/division.js";
import Task from "../models/task.js";
import Process from "../models/process.js";

export const higherManagerDashboardRepository = {
  // 🧭 Count all lands in a division
  async countTotalLands(divisionId) {
    const count = await Land.countDocuments({ divisionId });
    console.log("Total lands:", count);
    return count;
  },

  // 🌾 Calculate total area of lands in a division
  async calculateTotalArea(divisionId) {
    const result = await Land.aggregate([
      { $match: { divisionId } },
      { $group: { _id: null, totalArea: { $sum: "$area" } } },
    ]);

    const totalArea = result.length ? result[0].totalArea : 0;
    console.log("Total area:", totalArea);
    return totalArea;
  },

  // 🏢 Count number of divisions (for single division, always 1)
  async countDivisions(divisionId) {
    const count = await Division.countDocuments({ _id: divisionId });
    console.log("Divisions count:", count);
    return count || 1;
  },

  // 🚧 Count how many lands are currently in progress
  async countLandsInProgress(divisionId) {
    const landIds = await Land.find({ divisionId }).distinct("_id");
    if (landIds.length === 0) {
      console.log("Lands in progress: 0 (no lands found)");
      return 0;
    }

    const processIds = await Process.find({ landID: { $in: landIds } }).distinct("_id");
    if (processIds.length === 0) {
      console.log("Lands in progress: 0 (no processes found)");
      return 0;
    }

    const count = await Task.countDocuments({
      processID: { $in: processIds },
      status: "in progress",
    });

    console.log("Lands in progress:", count);
    return count;
  },

  // 📈 Get graph data (monthly land registrations per division)
  async getGraphData(divisionId) {
    const graphData = await Land.aggregate([
      { $match: { divisionId } },
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

  // 🗺️ Get coverage data — total area per land inside the division
  async getCoverageData(divisionId) {
    const coverageData = await Land.aggregate([
      { $match: { divisionId } },
      {
        $group: {
          _id: "$landName", // you can replace with "$subDivision" or another field if needed
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

export default {
  higherManagerDashboardRepository,
};
