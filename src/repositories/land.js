import Land from "../models/land.js";

export const createLand = async (landData) => {
  const newLand = await Land.create(landData);
  return newLand;
};

export default {
  createLand,
};
