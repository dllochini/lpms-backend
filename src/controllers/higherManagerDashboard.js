export const getHigherManagerDashboard = async (req, res) => {
  try {
    const { landId } = req.params;
    const { managerId } = req.query;

    if (!landId && !managerId) {
      return res.status(400).json({ message: "landId or managerId is required" });
    }

    const idToUse = { landId, managerId }; // pass as object

    const [
      totalLands,
      totalArea,
      totalDivisions,
      landsInProgress,
      graphData,
      coverageData
    ] = await Promise.all([
      higherManagerDashboardRepository.countTotalLands(idToUse),
      higherManagerDashboardRepository.calculateTotalArea(idToUse),
      higherManagerDashboardRepository.countDivisions(idToUse),
      higherManagerDashboardRepository.countLandsInProgress(idToUse),
      higherManagerDashboardRepository.getGraphData(idToUse),
      higherManagerDashboardRepository.getCoverageData(idToUse),
    ]);

    return res.json({
      overview: { totalLands, totalArea, divisions: totalDivisions, landsInProgress },
      graph: graphData,
      coverage: coverageData,
    });

  } catch (err) {
    console.error("Error fetching higher manager dashboard:", err);
    return res.status(500).json({ message: "Failed to fetch higher manager dashboard data" });
  }
};
