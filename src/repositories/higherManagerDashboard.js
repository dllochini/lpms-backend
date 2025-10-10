// repositories/higherManagerDashboard.js

import Land from "../models/land.js";

import Division from "../models/division.js"; // optional if you have division model
import Task from "../models/task.js";
import Process from "../models/process.js";

export const higherManagerDashboardRepository = {
  // 🧭 Count all lands under this manager (manager oversees many officers)
  async countTotalLands(higherManagerId) {
    // find all lands managed by officers who belong to this manager
    const count = await Land.countDocuments({ higherManagerId });
    console.log("Total lands:", count);
    return count;
  },

  // 🌾 Calculate total area of lands under this manager
  async calculateTotalArea(higherManagerId) {
    const result = await Land.aggregate([
      { $match: { higherManagerId } },
      { $group: { _id: null, totalArea: { $sum: "$area" } } },
    ]);
    const totalArea = result.length ? result[0].totalArea : 0;
    console.log("Total area:", totalArea);
    return totalArea;
  },

  // 🏢 Count the number of divisions this manager manages
  async countDivisions(higherManagerId) {
    const count = await Division.countDocuments({ higherManagerId });
    console.log("Divisions count:", count);
    return count;
  },

  // 🚧 Count how many lands are currently in progress
  async countLandsInProgress(higherManagerId) {
    const landIds = await Land.find({ higherManagerId }).distinct("_id");
    const processIds = await Process.find({ landID: { $in: landIds } }).distinct("_id");
    const count = await Task.countDocuments({ processID: { $in: processIds }, status: "in progress" });
    console.log("Lands in progress:", count);
    return count;
  },

  // 📈 Get graph data — for example: monthly land registrations
  async getGraphData(higherManagerId) {
    const graphData = await Land.aggregate([
      { $match: { higherManagerId } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // Format for frontend: [{ month: 'Jan', count: 10 }, ...]
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formatted = graphData.map((g) => ({
      month: monthNames[g._id - 1],
      count: g.count,
    }));

    console.log("Graph data:", formatted);
    return formatted;
  },

  // 🗺️ Get coverage data — e.g., total area per division
  async getCoverageData(higherManagerId) {
    const coverageData = await Land.aggregate([
      { $match: { higherManagerId } },
      {
        $group: {
          _id: "$divisionName",
          area: { $sum: "$area" },
        },
      },
      { $sort: { area: -1 } },
    ]);

    // Format for frontend: [{ division: 'North', area: 250 }, ...]
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
