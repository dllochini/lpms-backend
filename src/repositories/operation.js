import Operation from "../models/operation.js";

// Get all operations
export const getAllOperations = async () => {
  const operations = await Operation.find();
  return operations;
};

// Get single operation by ID
export const getOperationById = async (operationID) => {
  const operation = await Operation.findById(operationID);
  return operation;
};

// Create new operation
export const createOperation = async (operationData) => {
  const operation = new Operation(operationData);
  const newOperation = await operation.save();
  return newOperation;
};

// Update operation by ID
export const updateOperation = async (operationID, updateData) => {
  const updateOperation = await Operation.findByIdAndUpdate(operationID, updateData, { new: true });
  return updateOperation;
};

// Delete operation by ID
export const deleteOperation = async (operationID) => {
  const deleteOperation = await Operation.findByIdAndDelete(operationID);
  return deleteOperation;
};

 export default
 {
    getAllOperations,
    getOperationById,
    createOperation,
    updateOperation,
    deleteOperation,

};
