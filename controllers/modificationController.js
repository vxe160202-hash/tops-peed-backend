import { Modification } from '../models/Modification.js';

export const getModifications = async (req, res) => {
  try {
    const { carId, type } = req.query;
    const query = {};

    if (carId) {
      query.carId = carId;
    }
    if (type) {
      query.type = type;
    }

    const modifications = await Modification.find(query);
    res.json(modifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createModification = async (req, res) => {
  try {
    const modData = req.body;
    const modification = new Modification(modData);
    await modification.save();
    res.status(201).json(modification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateModification = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const modification = await Modification.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!modification) {
      return res.status(404).json({ error: 'Modification not found' });
    }

    res.json(modification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteModification = async (req, res) => {
  try {
    const { id } = req.params;
    const modification = await Modification.findByIdAndDelete(id);

    if (!modification) {
      return res.status(404).json({ error: 'Modification not found' });
    }

    res.json({ message: 'Modification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
