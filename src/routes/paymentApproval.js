import express from "express";
import { getPendingPayments, approvePayment, rejectPayment } from "../controllers/paymentApprovalController.js";

const router = express.Router();

router.get("/division/:divisionId", getPendingPayments);
router.put("/bill/:billId/approve", approvePayment);
router.put("/bill/:billId/reject", rejectPayment);

export default router;