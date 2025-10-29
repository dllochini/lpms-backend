// controllers/higherManagerDashboard.js
import higherManagerDashboardRepository from "../repositories/higherManagerDashboard.js";

export const getHigherManagerDashboard = async (req, res) => {
  try {
    const divisionId = req.query.divisionId || req.params.divisionId || null;

    // Detect if this route is "cards only"
    const isCardsRoute = typeof req.originalUrl === "string" && req.originalUrl.includes("/cards");

    if (isCardsRoute) {
      // Only return card info for the division
      const cardData = await higherManagerDashboardRepository.getHigherManagerDashboardCardInfo({ divisionId });
      return res.json(cardData);
    }

    // Full dashboard for global or division-specific
    const [
      overview,
      graph,
      coverage,
      recentOperations,
      recentPayments,
      progress,
    ] = await Promise.all([
      higherManagerDashboardRepository.getOverview({ divisionId }),
      higherManagerDashboardRepository.getGraphData({ divisionId }),
      higherManagerDashboardRepository.getCoverageData({ divisionId }),
      higherManagerDashboardRepository.getRecentOperations({ divisionId }),
      higherManagerDashboardRepository.getRecentPayments({ divisionId }),
      higherManagerDashboardRepository.getProgress({ divisionId }),
    ]);

    return res.json({
      overview: overview || { totalLands: 0, totalArea: 0, divisions: 0, landsInProgress: 0 },
      graph: graph || [],
      coverage: coverage || [],
      updates: [
        ...(Array.isArray(recentOperations) ? recentOperations.map(op => ({ id: op._id, title: op.name, date: op.startDate || op.createdAt })) : []),
        ...(Array.isArray(recentPayments) ? recentPayments.map(pay => ({ id: pay._id, title: `Payment - ${pay.amount}`, date: pay.createdAt })) : [])
      ],
      progress: progress || { pending: 0, inProgress: 0, completed: 0 }
    });
  } catch (err) {
    console.error("Error fetching higher manager dashboard:", err);
    return res.status(500).json({ message: "Failed to fetch higher manager dashboard data", error: err.message });
  }
};

export default { getHigherManagerDashboard };
