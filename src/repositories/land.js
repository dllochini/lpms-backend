import Land from '../models/land.js';

export const createLand = async (landData) => {
  const newLand = new Land(landData);
  return await newLand.save();
};

export default{
    createLand,
} 