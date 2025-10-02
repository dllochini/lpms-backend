import {
  getAllLands,
  createLand,
  deleteLand,
  updateLand,
  getLand,
  getLandsByFieldOfficer
} from "../repositories/land.js";

// Get all lands
export const getLands = async (req, res) => {
  try {
    const results = await getAllLands();
    console.log(results.length, "lands found ");
    res.json(results);
  } catch (error) {
    console.error("Error fetching lands:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get land by ID
export const getLandById = async (req, res) => {
  const landId = req.params.id;
  try {
    const land = await getLand(landId);
    if (!land) {
      return res.status(404).json({ error: "Land not found" });
    }
    res.json(land);
  } catch (error) {
    console.error("Error fetching land:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addNewLand = async (req, res) => {
  try {
    const landData = req.body;

    // Handle uploaded files
    if (req.files) {
      if (req.files.images) {
        landData.images = req.files.images.map((f) => ({
          filename: f.filename,
          path: f.path,
        }));
      }
      if (req.files.documents) {
        landData.documents = req.files.documents.map((f) => ({
          filename: f.filename,
          path: f.path,
        }));
      }
      if (req.files.signed_agreement) {
        landData.signed_agreement = {
          filename: req.files.signed_agreement[0].filename,
          path: req.files.signed_agreement[0].path,
        };
      }
    }

    const newLand = await createLand(landData);
    res.status(201).json(newLand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update land by ID
export const updateLandById = async (req, res) => {
  const landId = req.params.id;
  try {
    const updatedLand = await updateLand(landId, req.body);
    if (!updatedLand) {
      return res.status(404).json({ error: "Land not found" });
    }
    res.status(200).json(updatedLand);
  } catch (error) {
    console.error("Error updating land:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete land by ID
export const deleteLandById = async (req, res) => {
  const landId = req.params.id;
  try {
    const deletedLand = await deleteLand(landId);
    if (!deletedLand) {
      return res.status(404).json({ error: "Land not found" });
    }
    res.status(200).json({ message: "Land deleted successfully" });
  } catch (error) {
    console.error("Error deleting land:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getLandsByFieldOfficerId = async (req, res) => {
  try {

    console.log("in controller");

    const  {fieldOfficerId} = req.params;

    // 1️⃣ Get lands created by this officer
    const lands = await getLandsByFieldOfficer(fieldOfficerId);

    // const result = await Promise.all(
    //   lands.map(async (land) => {
    //     // 2️⃣ Populate processes and tasks
    //     const processes = await Process.find({ landId: land._id })
    //       .populate("tasks") // make sure "tasks" field exists in Process schema
    //       .lean();

    //     let currentStatus = "Not Started";
    //     let currentTask = null;
    //     let taskProgressPercent = 0;
    //     let overallProgressPercent = 0;

    //     if (processes.length > 0) {
    //       // Find ongoing process
    //       const ongoingProcess = processes.find(
    //         (p) => p.status === "in progress"
    //       );

    //       if (ongoingProcess) {
    //         currentStatus = "In Progress";
    //         // Pick current task (first in-progress or pending task)
    //         currentTask =
    //           ongoingProcess.tasks.find((t) => t.status === "in progress") ||
    //           ongoingProcess.tasks.find((t) => t.status === "pending") ||
    //           null;

    //         if (currentTask) {
    //           // Workdone calculation for task progress
    //           const workList = await WorkDone.find({ taskId: currentTask._id });
    //           const totalAmount = workList.reduce(
    //             (sum, w) => sum + (w.amount ?? 0),
    //             0
    //           );
    //           const expected = currentTask.expected_amount ?? 100;
    //           taskProgressPercent = Math.min(
    //             100,
    //             (totalAmount / expected) * 100
    //           );

    //           currentStatus = `In Progress - ${currentTask.name}`;
    //         }
    //       } else {
    //         // No ongoing process → mark cycles finished
    //         currentStatus = `${processes.length} cycles finished`;
    //       }

    //       // Overall progress calculation
    //       let totalWeight = 0;
    //       let weightedSum = 0;

    //       for (const p of processes) {
    //         for (const t of p.tasks) {
    //           const workList = await WorkDone.find({ taskId: t._id });
    //           const totalAmount = workList.reduce(
    //             (sum, w) => sum + (w.amount ?? 0),
    //             0
    //           );
    //           const expected = t.expected_amount ?? 100;
    //           const progress = Math.min(100, (totalAmount / expected) * 100);

    //           const weight = 1; // TODO: replace with operation weight if you have `operationId`
    //           weightedSum += (progress / 100) * weight;
    //           totalWeight += weight;
    //         }
    //       }
    //       overallProgressPercent =
    //         totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
    //     }

    //     return {
    //       landId: land._id,
    //       area: `${land.size} ${land.sizeUnitId}`,
    //       currentStatus,
    //       currentTask,
    //       taskProgressPercent,
    //       overallProgressPercent,
    //     };
    //   })
    // );

    // res.json(result);

    res
  } catch (error) {
    console.error("Error fetching lands by field officer:", error);
    res.status(500).json({ error: "Failed to fetch lands progress" });
  }
};

export default {
  getLands,
  getLandById,
  addNewLand,
  updateLandById,
  deleteLandById,
  getLandsByFieldOfficerId,
};
