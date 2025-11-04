import { getAllRoles } from "../repositories/role.js";


export const getRoles = async (req, res) => {
  try {
    const results = await getAllRoles();
    console.log(results.length, "results");
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default{
    getRoles,
}

