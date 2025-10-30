// controllers/billController.js
import { createBillForProcessTransactional, getBillByProcessId, updateBill} from "../repositories/bill.js";

export async function createBillForProcessHandler(req, res) {
  try {
    const { processId, notes } = req.body;
    if (!processId)
      return res.status(400).json({ error: "processId required" });

    const bill = await createBillForProcessTransactional({
      processId,
      notes: notes || "",
      processStatusToSet: "Sent for Payment Approval", // optional
      billStatus: "Sent for Manager Approval",
    });

    res.status(201).json({ success: true, bill });
  } catch (err) {
    console.error("createBill error", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
}

export const getBillsByDivisionController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const bills = await getBillsByDivision(userId);

    res.status(200).json({
      success: true,
      count: bills.length,
      data: bills,
    });
  } catch (error) {
    console.error("Controller error (getBillsByDivision):", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server error fetching bills by division",
    });
  }
};

export const updateBillById = async (req, res) => {
  try {
    const { billId } = req.params;
    const updateData = req.body;
    console.log("hello", billId, updateData);

    const updatedBill = await updateBill(billId, updateData);
    if (!updatedBill)
      return res.status(404).json({ message: "Bill not found" });
    res.status(200).json(updatedBill);
  } catch (error) {
    console.error("Error updating bill:", error);
    res.status(500).json({ message: "Failed to update bill", error });
  }
};

export const getBillByProcess = async (req, res) => {
  try {
    const { processId } = req.params;

    if (!processId) {
      return res.status(400).json({ error: "Process ID is required" });
    }

    const bills = await getBillByProcessId(processId);

    if (!bills || (Array.isArray(bills) && bills.length === 0)) {
      return res
        .status(404)
        .json({ message: "No bills found for this process" });
    }

    res.status(200).json({
      success: true,
      count: Array.isArray(bills) ? bills.length : 1,
      data: bills,
    });
  } catch (error) {
    console.error("Error in getBillByProcessIdController:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server error while fetching bills",
    });
  }
};
