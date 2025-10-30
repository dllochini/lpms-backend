import { paymentApprovalRepository } from "../repositories/paymentApproval.js";

export const getPendingPayments = async (req, res) => {
  try {
    const { divisionId } = req.params;
    if (!divisionId)
      return res.status(400).json({ message: "Division ID is required" });

    // Fetch pending payments from repository
    const pendingPayments = await paymentApprovalRepository.getPendingPaymentsByDivision(divisionId);

    return res.status(200).json({
      message: "Pending payments fetched successfully",
      data: pendingPayments,
    });
  } catch (err) {
    console.error("Error fetching pending payments:", err);
    return res.status(500).json({ message: "Failed to fetch pending payments" });
  }
};

// Approve payment
export const approvePayment = async (req, res) => {
  try {
    const { billId } = req.params;
    if (!billId)
      return res.status(400).json({ message: "Bill ID is required" });

    const updatedBill = await paymentApprovalRepository.approvePayment(billId);

    return res.status(200).json({
      message: "Payment approved successfully",
      data: updatedBill,
    });
  } catch (err) {
    console.error("Error approving payment:", err);
    return res.status(500).json({ message: "Failed to approve payment" });
  }
};

// Reject payment
export const rejectPayment = async (req, res) => {
  try {
    const { billId } = req.params;
    const { reason } = req.body;
    if (!billId)
      return res.status(400).json({ message: "Bill ID is required" });

    const updatedBill = await paymentApprovalRepository.rejectPayment(billId, reason);

    return res.status(200).json({
      message: "Payment rejected successfully",
      data: updatedBill,
    });
  } catch (err) {
    console.error("Error rejecting payment:", err);
    return res.status(500).json({ message: "Failed to reject payment" });
  }
};

export default {
  getPendingPayments,
  approvePayment,
  rejectPayment,
};
