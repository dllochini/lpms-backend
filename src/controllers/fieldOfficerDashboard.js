// controllers/fieldOfficerDashboardController.js
import { fieldOfficerDashboardRepository } from "../repositories/fieldOfficerDashboard.js";

export const getFieldOfficerDashboard = async (req, res) => {
  try {
    const { divisionId } = req.params;
    if (!divisionId)
      return res.status(400).json({ message: "Division ID is required" });

    // Fetch all data in parallel (replace landId with divisionId)
    const [
      totalLandsAssigned,
      totalFarmers,
      landsInProgress,
      recentOperations,
      recentPayments,
      progress
    ] = await Promise.all([
      fieldOfficerDashboardRepository.countAssignedLandsByDivision(divisionId),
      fieldOfficerDashboardRepository.countFarmersByDivision(divisionId),
      fieldOfficerDashboardRepository.countLandsInProgressByDivision(divisionId),
      fieldOfficerDashboardRepository.getRecentOperationsByDivision(divisionId),
      fieldOfficerDashboardRepository.getRecentPaymentsByDivision(divisionId)
    ]);

    return res.json({
      overview: {
        totalLands: totalLandsAssigned,
        farmers: totalFarmers,
        assignedLands: totalLandsAssigned,
        progressLand: landsInProgress,
      },
      updates: [
        ...recentOperations.map(op => ({
          id: op.id,
          title: op.title,
          time: op.time,
        })),
        ...recentPayments.map(pay => ({
          id: pay.id,
          title: pay.title,
          time: pay.time,
        }))
      ],
      progress: progress || { pending: 0, inProgress: 0, completed: 0 }
    });

  } catch (err) {
    console.error("Error fetching field officer dashboard:", err);
    return res.status(500).json({ message: "Failed to fetch field officer dashboard data" });
  }
};

export default {
  getFieldOfficerDashboard
};
