import Land from "../models/land.js";

export const getAllLands = async () => {
  const lands = await Land.find();
  return lands;
};

export const getLand = async (landId) => {
  const land = await Land.findById(landId);
  return land;
};

export const createLand = async (landData) => {
  const newLand = await Land.create(landData);
  return newLand;
};

export const updateLand = async (landId, updatedData) => {
  const updatedLand = await Land.findByIdAndUpdate(landId, updatedData, {
    new: true,
  });
  return updatedLand;
};

export const deleteLand = async (landId) => {
  const deletedLand = await Land.findByIdAndDelete(landId);
  return deletedLand;
};

export default {
  getAllLands,
  getLand,
  createLand,
  updateLand,
  deleteLand,
};
