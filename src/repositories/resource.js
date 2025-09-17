import Resource from "../models/resource.js";

export const addNewResource = async (data) => {
  const resource = new Resource(data);
  const newResource = await resource.save();
  return newResource;
};

export const getResources = async () => {
  const resources = await Resource.find().populate("unit", "name");
  console.log("In repo:", resources);
  return resources;
};

export const getResource = async (id) => {
  const resource = await Resource.findById(id).populate("unit", "name");
  return resource;
};

export const updateResource = async (id, data) => {
  const updateResource = await Resource.findByIdAndUpdate(id, data, {
    new: true,
  });
  return updateResource;
};

export const deleteResource = async (id) => {
  const deleteResource = await Resource.findByIdAndDelete(id);
  return deleteResource;
};

export default {
  addNewResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
};
