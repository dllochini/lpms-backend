import { higherManagerDashboardRepository } from "../repositories/higherManagerDashboard.js";

export const getDivisionDashboard = async (req, res) => {
  try {
    const { divisionId } = req.params;
    if (!divisionId)
      return res.status(400).json({ message: "Division ID is required" });

    // Fetch all stats in parallel
    const [
      totalLands,
      totalArea,
      totalDivisions,
      landsInProgress,
      graphData,
      coverageData
    ] = await Promise.all([
      higherManagerDashboardRepository.countTotalLands(divisionId),
      higherManagerDashboardRepository.calculateTotalArea(divisionId),
      higherManagerDashboardRepository.countDivisions(divisionId),
      higherManagerDashboardRepository.countLandsInProgress(divisionId),
      higherManagerDashboardRepository.getGraphData(divisionId),
      higherManagerDashboardRepository.getCoverageData(divisionId),
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

export default {
  getDivisionDashboard,
};
