// import { managerDashboardRepository } from "../repositories/managerDashboard.js";

// // ✅ Get Manager Dashboard card information
// export const getManagerDashboardCardInfo = async (req, res) => {
//   try {
//     const { divisionId } = req.params;

//     if (!divisionId) {
//       return res.status(400).json({ message: "Division ID is required" });
//     }

//     // Fetch overview + recent data from repository
//     const data = await managerDashboardRepository.getOverviewAndRecent(divisionId);

//     // Send a clean, structured JSON response
//     res.status(200).json({
//       totalLands: data.totalLands || 0,
//       totalFieldOfficers: data.totalFieldOfficers || 0,
//       pendingOperations: data.pendingOperations || 0,
//       pendingBills: data.pendingBills || 0,
//       recentRequests: data.recentRequests || [],
//       recentPayments: data.recentPayments || [],
//     });
//   } catch (error) {
//     console.error("Error fetching Manager Dashboard data:", error);
//     res.status(500).json({
//       message: "Failed to fetch Manager Dashboard data",
//       error: error.message,
//     });
//   }
// };


// controllers/managerDashboard.js
import mongoose from "mongoose";
import { managerDashboardRepository } from "../repositories/managerDashboard.js";
import Land from "../models/land.js";
import Process from "../models/process.js";
import Bill from "../models/bill.js";

/**
 * GET /manager-dashboard/:divisionId[?debug=1]
 * - Normal: returns overview & recent using the repository
 * - Debug mode (query.debug=1): also returns landIds, processIds, samplePendingBills, and deduped pending bill ids count
 */
export const getManagerDashboardCardInfo = async (req, res) => {
  try {
    const { divisionId } = req.params;
    const debug = req.query && (req.query.debug === "1" || req.query.debug === "true");

    if (!divisionId) {
      return res.status(400).json({ message: "Division ID is required" });
    }

    // 1) Main data (fast, from repository)
    const data = await managerDashboardRepository.getOverviewAndRecent(divisionId);

    // If debug not requested, return normal response
    if (!debug) {
      return res.status(200).json({
        totalLands: data.totalLands || 0,
        totalFieldOfficers: data.totalFieldOfficers || 0,
        pendingOperations: data.pendingOperations || 0,
        pendingBills: data.pendingBills || 0,
        recentRequests: data.recentRequests || [],
        recentPayments: data.recentPayments || [],
      });
    }

    // --- DEBUG MODE: compute intermediate arrays and sample bills so we can inspect shapes ---
    // Helper: try to convert to ObjectId when possible
    const toObjectIdMaybe = (id) => {
      if (!id) return null;
      if (id instanceof mongoose.Types.ObjectId) return id;
      if (mongoose.isValidObjectId(id)) return new mongoose.Types.ObjectId(id);
      return id;
    };
    const maybeObjectId = toObjectIdMaybe(divisionId);

    // 2) landIds (try both division shapes)
    const landQueryOr = [
      { division: maybeObjectId },
      { "division._id": maybeObjectId },
    ];
    if (typeof divisionId === "string") landQueryOr.push({ division: divisionId });

    const landIds = await Land.find({ $or: landQueryOr }).distinct("_id");

    // 3) processIds (try multiple land field names and process embedding division)
    const procOr = [];
    if (Array.isArray(landIds) && landIds.length > 0) {
      procOr.push({ landID: { $in: landIds } });
      procOr.push({ landId: { $in: landIds } });
      procOr.push({ land: { $in: landIds } });
    }
    procOr.push({ "division._id": maybeObjectId });
    procOr.push({ division: maybeObjectId });

    const processIds = await Process.find({ $or: procOr }).distinct("_id");

    // 4) Build a tolerant $or for bills (many field-name + string/ObjectId coverage)
    const processIdStrings = (processIds || []).map((p) => p.toString());
    const landIdStrings = (landIds || []).map((l) => l.toString());

    const billOr = [
      { "division._id": maybeObjectId },
      { division: maybeObjectId },
      { "division._id": divisionId },
      { division: divisionId },
    ];

    if (landIds.length > 0) {
      billOr.push({ land: { $in: landIds } });
      billOr.push({ land: { $in: landIdStrings } });
    }

    if (processIds.length > 0) {
      billOr.push({ processID: { $in: processIds } });
      billOr.push({ processId: { $in: processIds } });
      billOr.push({ process: { $in: processIds } });
      billOr.push({ process_id: { $in: processIds } });

      billOr.push({ processID: { $in: processIdStrings } });
      billOr.push({ processId: { $in: processIdStrings } });
      billOr.push({ process: { $in: processIdStrings } });
      billOr.push({ process_id: { $in: processIdStrings } });
    }

    // 5) Try fast distinct to get unique pending bill ids
    let dedupedBillIds = [];
    try {
      dedupedBillIds = await Bill.distinct("_id", { status: "pending", $or: billOr });
    } catch (err) {
      // ignore and fallback below
      console.warn("Bill.distinct failed in controller debug:", err);
    }

    // 6) If distinct returned none, fetch a set of pending bills and filter in JS (robust)
    let samplePendingBills = [];
    if (!dedupedBillIds || dedupedBillIds.length === 0) {
      const candidates = await Bill.find({ status: "pending" })
        .select("_id division land processID processId process process_id createdAt")
        .limit(2000)
        .lean();

      const matched = new Set();
      const samples = [];

      for (const b of candidates) {
        // division checks
        if (b.division) {
          if (b.division._id && b.division._id.toString() === maybeObjectId.toString()) {
            matched.add(b._id.toString());
            samples.push(b);
            continue;
          }
          if (b.division.toString && b.division.toString() === maybeObjectId.toString()) {
            matched.add(b._id.toString());
            samples.push(b);
            continue;
          }
          if (typeof b.division === "string" && b.division === divisionId) {
            matched.add(b._id.toString());
            samples.push(b);
            continue;
          }
        }

        // land checks
        if (b.land && (landIdStrings.includes(b.land.toString()) || landIds.some(l => l.toString() === b.land.toString()))) {
          matched.add(b._id.toString());
          samples.push(b);
          continue;
        }

        // process-like checks
        const procCandidates = [b.processID, b.processId, b.process, b.process_id].filter(Boolean);
        for (const pc of procCandidates) {
          if (pc && pc.toString && processIdStrings.includes(pc.toString())) {
            matched.add(b._id.toString());
            samples.push(b);
            break;
          }
          if (typeof pc === "string" && processIdStrings.includes(pc)) {
            matched.add(b._id.toString());
            samples.push(b);
            break;
          }
        }

        if (matched.size >= 10) break; // limit sample size
      }

      dedupedBillIds = Array.from(matched);
      samplePendingBills = samples.slice(0, 10);
    } else {
      // if distinct returned values, fetch a small sample of those bills for inspection
      samplePendingBills = await Bill.find({ _id: { $in: dedupedBillIds } })
        .select("_id division land processID processId process process_id createdAt")
        .limit(10)
        .lean();
    }

    // 7) Return everything including the repository overview
    return res.status(200).json({
      overview: {
        totalLands: data.totalLands || 0,
        totalFieldOfficers: data.totalFieldOfficers || 0,
        pendingOperations: data.pendingOperations || 0,
        pendingBills: data.pendingBills || 0,
      },
      recentRequests: data.recentRequests || [],
      recentPayments: data.recentPayments || [],
      debug: {
        divisionId,
        landIds,
        processIds,
        dedupedPendingBillCount: dedupedBillIds.length,
        dedupedPendingBillIds: dedupedBillIds.slice(0, 50), // limit payload
        samplePendingBills,
      },
    });
  } catch (error) {
    console.error("Error fetching Manager Dashboard data:", error);
    res.status(500).json({
      message: "Failed to fetch Manager Dashboard data",
      error: error.message,
    });
  }
};
