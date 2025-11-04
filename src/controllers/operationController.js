import {
  getAllOperations,
  getOperationById,
  createNewOperation,
  updateOperationById,
  deleteOperationById,
} from "../repositories/operation.js";

// Get all operations
export const getOperations = async (req, res) => {
  try {
    const operations = await getAllOperations();
    // console.log(operations,"in controller");
    res.status(200).json(operations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get operation by ID
export const getOperation = async (req, res) => {
  try {
    const operation = await getOperationById(req.params.id);
    if (!operation)
      return res.status(404).json({ message: "Operation not found" });
    res.json(operation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create operation
export const createOperation = async (req, res) => {
  try {
    const operation = await createNewOperation(req.body);
    res.status(201).json(operation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update operation
export const updateOperation = async (req, res) => {
  try {
    const operation = await updateOperationById(req.params.id, req.body);
    if (!operation)
      return res.status(404).json({ message: "Operation not found" });
    res.json(operation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete operation
export const deleteOperation = async (req, res) => {
  try {
    const operation = await deleteOperationById(req.params.id);
    if (!operation)
      return res.status(404).json({ message: "Operation not found" });
    res.json({ message: "Operation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getOperations,
  getOperation,
  createOperation,
  updateOperation,
  deleteOperation,
};
