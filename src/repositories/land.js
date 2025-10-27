import Land from "../models/land.js";
import User from "../models/user.js";

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
    const lands = await Land.find({ createdBy: fieldOfficerId }).populate("farmer").populate("unit");
    return lands;
  } catch (error) {
    console.error("Error fetching lands by field officer:", error);
    throw error;
  }
};

export const getLandsByDivision = async (managerId) => {
  try {
    // 1. Validate input
    if (!managerId) {
      throw new Error("Manager ID is required");
    }

    const user = await User.findById(managerId).populate("division");
    if (!user || !user.division?._id) {
      throw new Error("Manager or their division not found");
    }

    const divisionId = user.division._id;

    const lands = await Land.find({ division: divisionId }).populate("farmer").populate("unit").populate("createdBy").lean();
    console.log("Manager:", user.fullName, "| Division:", divisionId, "| Lands:", lands.length);
    return lands;
  } catch (error) {
    console.error("Error fetching lands by division:", error.message);
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
