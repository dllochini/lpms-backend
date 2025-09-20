import { get } from "mongoose";
import { getAllDivisions } from "../repositories/division.js";

export const getDivisions = async (req, res) => {
  try {
    const results = await getAllDivisions();
    console.log(results.length, "results");
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  getDivisions,
};
