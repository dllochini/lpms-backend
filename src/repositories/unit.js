
import Unit from "../models/unit.js";

// Get all units
export const getAllUnits = async () => {
  const units = await Unit.find();
  return units;
};

// Get a single unit by ID
export const getUnitById = async (unitID) => {
  const unit = await Unit.findById({ unitID });
  return unit;
};

// Create a new unit
export const createUnit = async (unitData) => {
  const unit = new Unit(unitData);
  const newUnit = await unit.save();
  return newUnit;
};

// Update a unit by ID
export const updateUnit = async (unitID, updateData) => {
  const updateUnit = await Unit.findByIdAndUpdate({ unitID }, updateData, { new: true });
  return updateUnit;
};

// Delete a unit by ID
export const deleteUnit = async (unitID) => {
 const deleteUnit = await Unit.findByIdAndDelete({ unitID });
 return deleteUnit;
};

export default {
  getAllUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit
};
