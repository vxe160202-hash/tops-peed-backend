import { Car } from '../models/Car.js';
import { Modification } from '../models/Modification.js';
import { getCarsByBrand, getCarByModel } from '../services/carApiService.js';

export const getAllCars = async (req, res) => {
  try {
    const { brand, isVisible, includeHidden } = req.query;
    const query = {};

    if (brand) {
      query.brand = brand;
    }
    
    // Only filter by visibility if includeHidden is not true
    if (includeHidden !== 'true') {
      if (isVisible !== undefined) {
        query.isVisible = isVisible === 'true';
      } else {
        query.isVisible = true;
      }
    }

    const cars = await Car.find(query).sort({ createdAt: -1 }).limit(100);
    console.log(`✅ Returning ${cars.length} cars from database`);
    res.json(cars);
  } catch (error) {
    console.error(`❌ Error fetching cars: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch cars from database', details: error.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    const modifications = await Modification.find({ carId: id });
    res.json({ car, modifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCar = async (req, res) => {
  try {
    const carData = req.body;
    const car = new Car(carData);
    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const car = await Car.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findByIdAndDelete(id);

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    await Modification.deleteMany({ carId: id });
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const importFromAPI = async (req, res) => {
  try {
    const { brand } = req.body;

    if (!brand) {
      return res.status(400).json({ error: 'Brand required' });
    }

    const apiCars = await getCarsByBrand(brand);
    const savedCars = [];

    for (const carData of apiCars) {
      const existingCar = await Car.findOne({
        brand: carData.brand,
        model: carData.model,
        year: carData.year,
      });

      if (!existingCar) {
        const car = new Car(carData);
        const saved = await car.save();
        savedCars.push(saved);
      }
    }

    res.status(201).json({
      message: `Imported ${savedCars.length} new cars`,
      cars: savedCars,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
