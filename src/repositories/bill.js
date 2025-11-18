import mongoose from "mongoose";
import Task from "../models/task.js";
import Bill from "../models/bill.js";
import User from "../models/user.js";
import Process from "../models/process.js";

const toOid = (id) => new mongoose.Types.ObjectId(id);

export async function createBillForProcessTransactional({
  processId,
  processStatusToSet = "Sent for Payment Approval",
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
      const tasks = await Task.aggregate([
        { $match: { process: procOid } },
        {
          $lookup: {
            from: "resources",
            localField: "resource",
            foreignField: "_id",
            as: "resource",
          },
        },
        { $unwind: { path: "$resource", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "workdone",
            localField: "_id",
            foreignField: "task",
            as: "workDones",
          },
        },
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
    const user = await User.findById(userId).populate("division");
    if (!user || !user.division?._id) {
      throw new Error("Manager or their division not found");
    }

    const divisionId = user.division._id;
    // console.log("Manager's division ID:", divisionId);
    const bills = await Bill.find({
      status: "Sent for Manager Approval" || "Sent for Payment Approval",
    })
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

    // console.log("Fetched bills:", bills);
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
  // console.log("updating bill in repo",billId,updateData);

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
