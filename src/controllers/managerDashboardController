import { managerDashboardRepository } from "../repositories/managerDashboard.js";

export const getDivisionDashboard = async (req, res) => {
  try {
    const { divisionId } = req.params;
    if (!divisionId) return res.status(400).json({ message: "Division ID is required" });

    const [
      totalLands,
      totalFieldOfficers,
      pendingOperationsCount,
      pendingBillsCount,
      pendingOpsArray,
      pendingBillsArray
    ] = await Promise.all([
      managerDashboardRepository.countLandsByDivision(divisionId),
      managerDashboardRepository.countFieldOfficersByDivision(divisionId),
      managerDashboardRepository.countPendingOperations(divisionId),
      managerDashboardRepository.countPendingBills(divisionId),
      managerDashboardRepository.getPendingOperationsByDivision(divisionId),
      managerDashboardRepository.getPendingBillsByDivision(divisionId)
    ]);

    return res.json({
      totalLands,
      totalFieldOfficers,
      pendingOperations: pendingOperationsCount,
      pendingBills: pendingBillsCount,
      recentRequests: pendingOpsArray,   // frontend expects this key
      recentPayments: pendingBillsArray  // frontend expects this key
    });

  } catch (err) {
    console.error("Error fetching division dashboard:", err);
    return res.status(500).json({ message: "Failed to fetch division dashboard data" });
  }
};

export default {
  getDivisionDashboard,
};
