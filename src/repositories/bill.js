import mongoose from "mongoose";
import Task from "../models/task.js";
import Bill from "../models/bill.js";
import User from "../models/user.js";
import Process from "../models/process.js";

const toOid = (id) => new mongoose.Types.ObjectId(id);

export async function createBillForProcessTransactional({
  processId,
  processStatusToSet = "Sent for Payment Approval", // optional
  billStatus = "Sent for Manager Approval",
  notes = "",
  sessionOptions = {},
} = {}) {
  if (!mongoose.Types.ObjectId.isValid(processId)) {
    throw new Error("Invalid processId");
  }
  const procOid = toOid(processId);
  const session = await mongoose.startSession();

  try {
    let createdBill = null;

    await session.withTransaction(async () => {
      // 1) aggregate tasks with resources and workdones, compute amounts
      const tasks = await Task.aggregate([
        { $match: { process: procOid } },

        // lookup resource to get unitPrice (adjust collection name if different)
        {
          $lookup: {
            from: "resources",
            localField: "resource",
            foreignField: "_id",
            as: "resource",
          },
        },
        { $unwind: { path: "$resource", preserveNullAndEmptyArrays: true } },

        // lookup workdones
        {
          $lookup: {
            from: "workdone",
            localField: "_id",
            foreignField: "task",
            as: "workDones",
          },
        },

        // compute each workdone amount = newWork * resource.unitPrice
        {
          $addFields: {
            workDonesWithAmount: {
              $map: {
                input: { $ifNull: ["$workDones", []] },
                as: "wd",
                in: {
                  _id: "$$wd._id",
                  amount: {
                    $multiply: [
                      { $ifNull: ["$$wd.newWork", 0] },
                      { $ifNull: ["$resource.unitPrice", 0] },
                    ],
                  },
                },
              },
            },
          },
        },

        // sum the workdone amounts to taskTotal
        {
          $addFields: {
            taskTotal: { $sum: "$workDonesWithAmount.amount" },
          },
        },

        {
          $project: {
            _id: 1,
            taskTotal: 1,
            workDonesWithAmount: 1,
          },
        },
      ]).session(session);

      // 2) build arrays and totals
      const taskSubTotals = [];
      const workdoneSubTotals = [];
      let grandTotal = 0;

      for (const t of tasks) {
        const tId = t._id;
        const subtotal =
          typeof t.taskTotal === "number"
            ? t.taskTotal
            : Number(t.taskTotal || 0);
        taskSubTotals.push({ task: tId, subtotal });
        grandTotal += subtotal;

        if (Array.isArray(t.workDonesWithAmount)) {
          for (const wd of t.workDonesWithAmount) {
            workdoneSubTotals.push({
              workDone: wd._id,
              amount: wd.amount || 0,
            });
          }
        }
      }

      // 3) update process status (optional) within same transaction
      await Process.findByIdAndUpdate(
        procOid,
        {
          status: processStatusToSet,
          endDate: processStatusToSet === "Done" ? new Date() : undefined,
          $push: {
            updatedHistory: {
              updatedAt: new Date(),
              changes: { status: processStatusToSet },
            },
          },
        },
        { new: true, session }
      );

      // 4) create the bill document within transaction
      createdBill = await Bill.create(
        [
          {
            process: procOid,
            totalAmount: grandTotal,
            taskSubTotals,
            workdoneSubTotals,
            notes,
            status: billStatus,
          },
        ],
        { session }
      );
      // createdBill is an array because create([...], { session }) returns array
      createdBill = createdBill[0];
    }, sessionOptions);

    return createdBill;
  } finally {
    session.endSession();
  }
}

export const getBillsByDivision = async (userId) => {
  try {
    if (!userId) {
      throw new Error("Manager ID is required");
    }

    // 1️⃣ Get manager and their division
    const user = await User.findById(userId).populate("division");
    if (!user || !user.division?._id) {
      throw new Error("Manager or their division not found");
    }

    const divisionId = user.division._id;

    // 2️⃣ Get all bills and deeply populate
    const bills = await Bill.find({ status: "Sent for Manager Approval" })
      .populate({
        path: "process",
        populate: {
          path: "land",
          populate: "createdBy",
        },
      })
      // 👇 populate the task details inside each bill’s taskSubTotals array
      .populate({
        path: "taskSubTotals.task",
        populate: [
          { path: "operation" },
          { path: "resource", populate: { path: "unit" } },
        ],
      })
      // 👇 populate the workdone details inside each bill’s workdoneSubTotals array
      .populate({
        path: "workdoneSubTotals.workDone", // adjust based on schema
      })
      .lean();

    // 3️⃣ Keep only bills belonging to manager's division
    const filteredBills = bills.filter(
      (bill) =>
        bill?.process?.land?.division?._id?.toString() === divisionId.toString()
    );

    return filteredBills;
  } catch (error) {
    console.error("Error fetching bills by division:", error.message);
    throw error;
  }
};

export const updateBill = async (billId, updateData) => {

  console.log("updating bill in repo",billId,updateData);

  const updated = await Bill.findByIdAndUpdate(String(billId), updateData, {
    new: true,
  });
  return updated;
};

export const getBillByProcessId = async (processId) => {
  try {
    if (!processId) {
      throw new Error("Process ID is required");
    }

    const bills = await Bill.find({ process: processId })
      .populate({
        path: "process",
        populate: {
          path: "land",
          populate: "createdBy",
        },
      })
      .populate({
        path: "taskSubTotals.task",
        populate: [
          { path: "operation" },
          { path: "resource", populate: { path: "unit" } },
        ],
      })
      .populate({
        path: "workdoneSubTotals.workDone",
      })
      .lean();

    return bills;
  } catch (error) {
    console.error("Error fetching bills by process ID:", error.message);
    throw error;
  }
};
