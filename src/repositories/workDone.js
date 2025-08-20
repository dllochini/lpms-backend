import WorkDone from "../models/workDone.js";

// Create a new WorkDone entry
export const createWorkDone = async (data) => {
  const workDone = new WorkDone(data);
  const newWork = await workDone.save();
  return newWork;
};

// Get all WorkDone entries
export const getAllWorkDone = async () => {
  const works = await WorkDone.find()
    .populate("resource", "resource_Name") // populate resource name
    .populate("task", "task_Name"); // populate task name
  return works;
};

// Get a single WorkDone by ID
export const getWorkDoneById = async (id) => {
  const work = await WorkDone.findById(id)
    .populate("resource", "resource_Name")
    .populate("task", "task_Name");
  return work;
};

// Update WorkDone by ID
export const updateWorkDone = async (id, data) => {
  const updateWorkDone = await WorkDone.findByIdAndUpdate(id, data, { new: true });
  return updateWorkDone;
};

// Delete WorkDone by ID
export const deleteWorkDone = async (id) => {
  const deleteWorkDone = await WorkDone.findByIdAndDelete(id);
  return deleteWorkDone;
};
