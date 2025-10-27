import {createProcess, deleteProcess, getProcessByLandId, updateProcess} from "../repositories/process.js";

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

export const updateProcessById = async (req, res) => {
  try {
    const {processId} = req.params;
    const updateData = req.body;
    const updatedProcess = await updateProcess(processId, updateData);
    if (!updatedProcess) return res.status(404).json({ message: "process not found" });
    res.status(200).json(updatedProcess);
  } catch (error) {
    console.error("Error updating process:", error);
    res.status(500).json({ message: "Failed to update process", error });
  }
};

export const createProcessById = async (req, res) => {
  try {
    const processData = req.body;
    console.log(processData,"data");
    const newProcess = await createProcess(processData);
    res.status(201).json(newProcess);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Failed to create task", error });
  }
};

export const deleteProcessById = async (req, res) => {
  try {
    console.log("helloo process");
    const {processId}  = req.params;
    console.log(processId,"helloo process");
    const result = await deleteProcess(processId);
    if (!result) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
    processesByLandHandler,
}