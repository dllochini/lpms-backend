import Unit from "../models/unit.js";

export const getAllUnits = async () => {
  const units = await Unit.find();
  return units;
};

export const getUnitById = async (unitID) => {
  const unit = await Unit.findById({ unitID });
  return unit;
};

export const createUnit = async (unitData) => {
  const unit = new Unit(unitData);
  const newUnit = await unit.save();
  return newUnit;
};

export const updateUnit = async (unitID, updateData) => {
  const updateUnit = await Unit.findByIdAndUpdate({ unitID }, updateData, {
    new: true,
  });
  return updateUnit;
};

export const deleteUnit = async (unitID) => {
  const deleteUnit = await Unit.findByIdAndDelete({ unitID });
  return deleteUnit;
};

export default {
  getAllUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
};
