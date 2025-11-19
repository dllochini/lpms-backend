import WorkDone from "../models/workDone.js";

export const createWorkDone = async (data) => {
  const workDone = new WorkDone(data);
  const newWork = await workDone.save();
  return newWork;
};

export const getAllWorkDone = async () => {
  const works = await WorkDone.find()
    .populate("resource", "resource_Name")
    .populate("task", "task_Name");
  return works;
};

export const getWorkDoneById = async (id) => {
  const work = await WorkDone.findById(id)
    .populate("resource", "resource_Name")
    .populate("task", "task_Name");
  return work;
};

export const updateWorkDone = async (id, data) => {
  const updateWorkDone = await WorkDone.findByIdAndUpdate(id, data, {
    new: true,
  });
  return updateWorkDone;
};

export const deleteWorkDone = async (id) => {
  const deleteWorkDone = await WorkDone.findByIdAndDelete(id);
  return deleteWorkDone;
};
