// controllers/fieldOfficerDashboardController.js
import { fieldOfficerDashboardRepository } from "../repositories/fieldOfficerDashboard.js";

export const getFieldOfficerDashboard = async (req, res) => {
  try {
    const { landId } = req.params;
    if (!landId)
      return res.status(400).json({ message: "Officer ID is required" });

    // Fetch all data in parallel
    const [
      totalLandsAssigned,
      totalFarmers,
      landsInProgress,
      recentOperations,
      recentPayments
    ] = await Promise.all([
      fieldOfficerDashboardRepository.countAssignedLands(landId),
      fieldOfficerDashboardRepository.countFarmers(landId),
      fieldOfficerDashboardRepository.countLandsInProgress(landId),
      fieldOfficerDashboardRepository.getRecentOperations(landId),
      fieldOfficerDashboardRepository.getRecentPayments(landId)
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
      progress: {
        pending: totalLandsAssigned ? Math.round((totalLandsAssigned - landsInProgress) / totalLandsAssigned * 100) : 0,
        inProgress: landsInProgress ? Math.round(landsInProgress / totalLandsAssigned * 100) : 0,
        completed: 0, // Optional: add logic for completed lands
      }
    });

  } catch (err) {
    console.error("Error fetching field officer dashboard:", err);
    return res.status(500).json({ message: "Failed to fetch field officer dashboard data" });
  }
};

export default {
  getFieldOfficerDashboard
};
