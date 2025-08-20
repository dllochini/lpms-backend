import * as workDoneRepo from "../repositories/workDone.js";

// Create WorkDone
export const createWorkDone = async (req, res) => {
  try {
    const result = await workDoneRepo.createWorkDone(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all WorkDone
export const getAllWorkDone = async (req, res) => {
  try {
    const results = await workDoneRepo.getAllWorkDone();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get WorkDone by ID
export const getWorkDoneById = async (req, res) => {
  try {
    const result = await workDoneRepo.getWorkDoneById(req.params.id);
    if (!result) return res.status(404).json({ message: "Not found" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update WorkDone by ID
export const updateWorkDone = async (req, res) => {
  try {
    const result = await workDoneRepo.updateWorkDone(req.params.id, req.body);
    if (!result) return res.status(404).json({ message: "Not found" });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete WorkDone by ID
export const deleteWorkDone = async (req, res) => {
  try {
    const result = await workDoneRepo.deleteWorkDone(req.params.id);
    if (!result) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
