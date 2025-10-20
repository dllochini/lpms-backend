import {getProcessByLandId} from "../repositories/process.js";

export const processesByLandHandler = async (req, res) => {
  try {
    // console.log("in process controller");
    const { landId } = req.params;
    const data = await getProcessByLandId(landId);
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export default {
    processesByLandHandler,
}