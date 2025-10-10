// controllers/higherManagerDashboardController.js
import { higherManagerDashboardRepository } from "../repositories/higherManagerDashboard.js";

export const getHigherManagerDashboard = async (req, res) => {
  try {
    const { higherManagerId } = req.params;
    if (!higherManagerId)
      return res.status(400).json({ message: "HigherManager ID is required" });

    // Fetch all stats in parallel
    const [
      totalLands,
      totalArea,
      totalDivisions,
      landsInProgress,
      graphData,
      coverageData
    ] = await Promise.all([
      higherManagerDashboardRepository.countTotalLands(higherManagerId),
      higherManagerDashboardRepository.calculateTotalArea(higherManagerId),
      higherManagerDashboardRepository.countDivisions(higherManagerId),
      higherManagerDashboardRepository.countLandsInProgress(higherManagerId),
      higherManagerDashboardRepository.getGraphData(higherManagerId),
      higherManagerDashboardRepository.getCoverageData(higherManagerId),
    ]);

    // Structure response for frontend
    return res.json({
      overview: {
        totalLands,
        totalArea,
        divisions: totalDivisions,
        landsInProgress,
      },
      graph: graphData,
      coverage: coverageData,
    });

  } catch (err) {
    console.error("Error fetching higher manager dashboard:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch higher manager dashboard data" });
  }
};

export default {
  getHigherManagerDashboard,
};
