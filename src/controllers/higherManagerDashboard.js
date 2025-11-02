// // src/controllers/higherManagerDashboard.js


// import { higherManagerDashboardRepository } from "../repositories/higherManagerDashboard.js";

// export const getHigherManagerDashboard = async (req, res) => {
//   try {
//     const divisionId = req.query.divisionId || req.params.divisionId || null;

    
//     /*
//     const isCardsRoute = typeof req.originalUrl === "string" && req.originalUrl.includes("/cards");
//     if (isCardsRoute) {
//       const cardData = await higherManagerDashboardRepository.getHigherManagerDashboardCardInfo({ divisionId });
//       return res.json(cardData);
//     }
//     */

    
//     const [
//       overview,
//       // ...
//     ] = await Promise.all([
//       higherManagerDashboardRepository.getOverview({ divisionId }),
//       // ...
//     ]);

//     return res.json({
//       overview: overview || { totalLands: 0, totalArea: 0, divisions: 0, landsInProgress: 0 },
//       // ...
//     });
//   } catch (err) {
//     console.error("Error fetching higher manager dashboard:", err);
//     return res.status(500).json({ message: "Failed to fetch higher manager dashboard data", error: err.message });
//   }
// };

// src/controllers/higherManagerDashboard.js
import { higherManagerDashboardRepository } from "../repositories/higherManagerDashboard.js";

export const getHigherManagerDashboard = async (req, res) => {
  try {
   const divisionId = req.query.divisionId || req.params.divisionId || null;

// THIS IS THE CORRECT FUNCTION TO CALL
 // It matches what your React component expects.
    const dashboardData = await higherManagerDashboardRepository.getHigherManagerDashboardCardInfo({ divisionId });

    // This returns the full { overview, graph, coverage } object
    return res.json(dashboardData);

  } catch (err) {
    console.error("Error fetching higher manager dashboard:", err);
    return res.status(500).json({ message: "Failed to fetch higher manager dashboard data", error: err.message });
  }
};