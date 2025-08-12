// repositories/unit.js
import Unit from "../models/unit.js";

// Get all units
export const getAllUnits = async () => {
  return await Unit.find();
};

// Get a single unit by ID
export const getUnitById = async (unitID) => {
  return await Unit.findOne({ unitID });
};

// Create a new unit
export const createUnit = async (unitData) => {
  const unit = new Unit(unitData);
  return await unit.save();
};

// Update a unit by ID
export const updateUnit = async (unitID, updateData) => {
  return await Unit.findOneAndUpdate({ unitID }, updateData, { new: true });
};

// Delete a unit by ID
export const deleteUnit = async (unitID) => {
  return await Unit.findOneAndDelete({ unitID });
};

export default {
  getAllUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit
};
