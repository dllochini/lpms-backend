import { managerDashboardRepository } from "../repositories/managerDashboard.js";

export const getManagerDashboardCardInfo = async (req, res) => {
  try {
    const { divisionId } = req.params;

    if (!divisionId) {
      return res.status(400).json({ message: "Division ID is required" });
    }

    const data = await managerDashboardRepository.getOverviewAndRecent(divisionId);

    res.status(200).json({
      totalLands: data.totalLands || 0,
      totalFieldOfficers: data.totalFieldOfficers || 0,
      pendingOperations: data.pendingOperations || 0,
      pendingBills: data.pendingBills || 0,
      recentRequests: data.recentRequests || [],
      recentPayments: data.recentPayments || [],
    });
  } catch (error) {
    console.error("Error fetching Manager Dashboard data:", error);
    res.status(500).json({
      message: "Failed to fetch Manager Dashboard data",
      error: error.message,
    });
  }
};
