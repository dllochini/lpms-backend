import Implement from "../models/implement.js";
import Operation from "../models/operation.js";
import mongoose from "mongoose";

// Get all implements
// export const getAllImplements = async () => {
//   return await Implement.find().populate("operations");
// };

// // Get implement by ID
// export const getImplementById = async (implementId) => {
//   return await Implement.findById(implementId).populate("operations");
// };

// Get implements by operation ID
export const getImplementsByOperationId = async (operationId, { page = 1, limit = 20 } = {}) => {
  if (!mongoose.Types.ObjectId.isValid(operationId)) {
    throw new Error("Invalid operation ID");
  }

  const skip = (page - 1) * limit;

  const [ total, imp ] = await Promise.all([
    Implement.countDocuments({ operations: operationId }),
    Implement.find({ operations: operationId })
      .skip(skip)
      .limit(limit)
      .populate("operations")
      .sort({ createdAt: -1 })
  ]);

  return { meta: { page, limit, total, pages: Math.ceil(total / limit) }, data: imp };
};

// Create new implement
// export const createImplement = async (implementData) => {
//   return await Implement.create(implementData);
// };

// Update implement by ID
// export const updateImplement = async (implementId, updatedData) => {
//   return await Implement.findByIdAndUpdate(implementId, updatedData, { new: true });
// };

// Delete implement by ID
// export const deleteImplement = async (implementId) => {
//   return await Implement.findByIdAndDelete(implementId);
// };

export default {
//   getAllImplements,
//   getImplementById,
  getImplementsByOperationId,
//   createImplement,
//   updateImplement,
//   deleteImplement,
};
