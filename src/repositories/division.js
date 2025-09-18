import Division from "../models/division.js";

export const getAllDivisions = async () => {
  const divisions = await Division.find();
  return divisions;
};

export default {
  getAllDivisions,
};
