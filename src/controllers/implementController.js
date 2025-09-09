import { getImplementsByOperationId } from "../repositories/implement.js";

// Get implements by operation ID
export const fetchImplementsByOperationId = async (req, res) => {
  const { operationId } = req.params;
  const { page, limit } = req.query;

  try {
    const result = await getImplementsByOperationId(operationId, { page: parseInt(page), limit: parseInt(limit) });
    res.json(result);
  } catch (err) {
    console.error("Error fetching implements by operation ID:", err);
    res.status(400).json({ error: err.message });
  }
};

export default { fetchImplementsByOperationId };