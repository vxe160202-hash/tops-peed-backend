import { Car } from '../models/Car.js';
import { calculateModificationImpact } from '../utils/performanceCalculator.js';

export const calculateConfiguration = async (req, res) => {
  try {
    const { carId, modifications } = req.body;

    if (!carId || !modifications) {
      return res.status(400).json({ error: 'Car ID and modifications required' });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    const impact = calculateModificationImpact(car, modifications);
    res.json(impact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
