import Operation from "../models/operation.js";

export const getAllOperations = async () => {
  const operations = await Operation.find();
  return operations;
};

export const getOperationById = async (operationID) => {
  const operation = await Operation.findById(operationID);
  return operation;
};

export const createNewOperation = async (operationData) => {
  const operation = new Operation(operationData);
  const newOperation = await operation.save();
  return newOperation;
};

export const updateOperationById = async (operationID, updateData) => {
  const updateOperation = await Operation.findByIdAndUpdate(
    operationID,
    updateData,
    { new: true }
  );
  return updateOperation;
};

export const deleteOperationById = async (operationID) => {
  const deleteOperation = await Operation.findByIdAndDelete(operationID);
  return deleteOperation;
};

export default {
  getAllOperations,
  getOperationById,
  createNewOperation,
  updateOperationById,
  deleteOperationById,
};
