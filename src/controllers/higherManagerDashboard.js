// controllers/higherManagerDashboard.js
import { higherManagerDashboardRepository } from "../repositories/higherManagerDashboard.js";

export const getHigherManagerDashboard = async (req, res) => {
  try {
    const { landId } = req.params;
    if (!landId)
      return res.status(400).json({ message: "Land ID is required" });

    // Fetch all stats in parallel
    const [
      totalLands,
      totalArea,
      totalDivisions,
      landsInProgress,
      graphData,
      coverageData
    ] = await Promise.all([
      higherManagerDashboardRepository.countTotalLands(landId),
      higherManagerDashboardRepository.calculateTotalArea(landId),
      higherManagerDashboardRepository.countDivisions(landId),
      higherManagerDashboardRepository.countLandsInProgress(landId),
      higherManagerDashboardRepository.getGraphData(landId),
      higherManagerDashboardRepository.getCoverageData(landId),
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
    console.error("Error fetching division dashboard:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch division dashboard data" });
  }
};
