import { higherManagerDashboardRepository } from "../repositories/higherManagerDashboard.js";

export const getHigherManagerDashboard = async (req, res) => {
  try {
    const divisionId = req.query.divisionId || req.params.divisionId || null;

    const dashboardData =
      await higherManagerDashboardRepository.getHigherManagerDashboardCardInfo({
        divisionId,
      });
    return res.json(dashboardData);
  } catch (err) {
    console.error("Error fetching higher manager dashboard:", err);
    return res.status(500).json({
      message: "Failed to fetch higher manager dashboard data",
      error: err.message,
    });
  }
};
