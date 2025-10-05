import Land from "../models/land.js";
import Process from "../models/process.js";
import Task from "../models/task.js";
import WorkDone from "../models/workDone.js";

export const getAllLands = async () => {
  const lands = await Land.find();
  return lands;
};

export const getLand = async (landId) => {
  console.log("Fetching land with ID:", landId);
  const land = await Land.findById(landId).populate("farmer").populate("unit").populate("division");
  return land;
};

export const getLandsByFieldOfficer = async (fieldOfficerId) => {
  try {
    const lands = await Land.find({ createdBy: fieldOfficerId })
      .populate("farmer")
      .populate("unit");
    // console.log("in repo", lands);
    return lands;
  } catch (error) {
    console.error("Error fetching lands by field officer:", error);
    throw error;
  }
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
