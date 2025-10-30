import Land from "../models/land.js";
import Process from "../models/process.js";
import Bill from "../models/bill.js";
/**
 * Repository for Higher Manager - Payment Approval operations
 */
export const paymentApprovalRepository = {
  /**
   * Get all pending payments for a given division.
   * Steps:
   *   1. Find all lands in the division
   *   2. Find processes related to those lands
   *   3. Find bills with "sent for approval" status linked to those processes
   */
  async getPendingPaymentsByDivision(divisionId) {
    try {
      // Step 1: find all lands in the division
      const landIds = await Land.find({ division: divisionId }).distinct("_id");

      // Step 2: find all processes belonging to those lands
      const processIds = await Process.find({
        landId: { $in: landIds },
      }).distinct("_id");

      // Step 3: find bills with pending status
      const pendingBills = await Bill.find({
        processID: { $in: processIds },
        status: "sent for approval",
      })
        .populate({
          path: "processID",
          populate: {
            path: "landId",
            select: "landName division",
          },
        })
        .populate("createdBy", "fullName email")
        .populate("accountant", "fullName email")
        .lean();

      return pendingBills;
    } catch (err) {
      console.error("Error in getPendingPaymentsByDivision:", err);
      throw err;
    }
  },

  /**
   * Approve a payment (Bill)
   * @param {string} billId
   */
  async approvePayment(billId) {
    try {
      const bill = await Bill.findOneAndUpdate(
        { _id: billId },
        { status: "Approved", approvedDate: new Date() },
        { new: true }
      );
      return bill;
    } catch (err) {
      console.error("Error approving payment:", err);
      throw err;
    }
  },

  /**
   * Reject a payment (Bill)
   * @param {string} billId
   */
  async rejectPayment(billId, reason) {
    try {
      const bill = await Bill.findOneAndUpdate(
        { _id: billId },
        { status: "Rejected", rejectionReason: reason, rejectedDate: new Date() },
        { new: true }
      );
      return bill;
    } catch (err) {
      console.error("Error rejecting payment:", err);
      throw err;
    }
  },

  /**
   * Count pending payments in a division
   */
  async countPendingPayments(divisionId) {
    try {
      const landIds = await Land.find({ division: divisionId }).distinct("_id");
      const processIds = await Process.find({
        landId: { $in: landIds },
      }).distinct("_id");

      const count = await Bill.countDocuments({
        processID: { $in: processIds },
        status: "sent for approval",
      });

      return count;
    } catch (err) {
      console.error("Error counting pending payments:", err);
      return 0;
    }
  },
};

export default {
  paymentApprovalRepository,
};
