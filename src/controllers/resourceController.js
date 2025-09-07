// import {createResource, getAllResources, getResourceById, updateResource, deleteResource, addNewResource} from "../repositories/resource.js";
import addNewResource, { getResources, getResourceById, updateResourceById, deleteResourceUserById } from "../repositories/resource.js";


export const createResource = async (req, res) => {
  try {
    const resource = await addNewResource(req.body);
    res.status(201).json(resource);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create resource", error: error.message });
  }
};

export const getAllResources = async (req, res) => {
  try {
    console.log("In controller");
    const resources = await getResources();
    console.log("response:",resources);
    res.status(200).json(resources);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch resources", error: error.message });
  }
};

export const getResource = async (req, res) => {
  try {
    const resource = await getResourceById(req.params.id);
    if (!resource)
      return res.status(404).json({ message: "Resource not found" });
    res.status(200).json(resource);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch resource", error: error.message });
  }
};

export const updateResource = async (req, res) => {
  try {
    const updatedResource = await resourceRepo.updateResource(
      req.params.id,
      req.body
    );
    if (!updatedResource)
      return res.status(404).json({ message: "Resource not found" });
    res.status(200).json(updatedResource);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update resource", error: error.message });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const deletedResource = await resourceRepo.deleteResource(req.params.id);
    if (!deletedResource)
      return res.status(404).json({ message: "Resource not found" });
    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to delete resource", error: error.message });
  }
};

export default {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
};
