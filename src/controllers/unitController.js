import unitRepository from "../repositories/unit.js";

export const getUnits = async (req, res) => {
  try {
    const units = await unitRepository.getAllUnits();
    res.json(units);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUnit = async (req, res) => {
  try {
    const unit = await unitRepository.getUnitById(req.params.id);
    if (!unit) return res.status(404).json({ message: "Unit not found" });
    res.json(unit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUnit = async (req, res) => {
  try {
    const newUnit = await unitRepository.createUnit(req.body);
    res.status(201).json(newUnit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUnit = async (req, res) => {
  try {
    const updatedUnit = await unitRepository.updateUnit(req.params.id, req.body);
    if (!updatedUnit) return res.status(404).json({ message: "Unit not found" });
    res.json(updatedUnit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUnit = async (req, res) => {
  try {
    const deletedUnit = await unitRepository.deleteUnit(req.params.id);
    if (!deletedUnit) return res.status(404).json({ message: "Unit not found" });
    res.json({ message: "Unit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
