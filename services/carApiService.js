import axios from 'axios';

const API_NINJAS_KEY = process.env.API_NINJAS_KEY;
const API_NINJAS_URL = 'https://api.api-ninjas.com/v1/cars';

export const getCarsByBrand = async (brand) => {
  try {
    const response = await axios.get(API_NINJAS_URL, {
      params: {
        make: brand,
        limit: 10,
      },
      headers: {
        'X-Api-Key': API_NINJAS_KEY,
      },
    });

    return response.data.map((car) => ({
      brand: car.make,
      model: car.model,
      year: car.year,
      engine: {
        displacement: car.engine?.displacement,
        cylinders: car.engine?.cylinders,
        type: car.engine?.type,
      },
      horsepower: car.horsepower || 0,
      torque: car.torque || 0,
      fuelType: car.fuel_type || 'Petrol',
      drivetrain: car.drive_type || 'RWD',
      acceleration: car.acceleration || 10,
      topSpeed: car.top_speed_mph ? Math.round(car.top_speed_mph * 1.60934) : 200,
      category: 'Sedan',
      apiSource: 'api-ninjas',
      externalId: `${car.make}-${car.model}-${car.year}`,
    }));
  } catch (error) {
    console.error('Error fetching from API-Ninjas:', error.message);
    throw new Error('Failed to fetch car data from API');
  }
};

export const getCarByModel = async (brand, model) => {
  try {
    const response = await axios.get(API_NINJAS_URL, {
      params: {
        make: brand,
        model: model,
        limit: 5,
      },
      headers: {
        'X-Api-Key': API_NINJAS_KEY,
      },
    });

    if (response.data.length === 0) {
      return null;
    }

    const car = response.data[0];
    return {
      brand: car.make,
      model: car.model,
      year: car.year,
      engine: {
        displacement: car.engine?.displacement,
        cylinders: car.engine?.cylinders,
        type: car.engine?.type,
      },
      horsepower: car.horsepower || 0,
      torque: car.torque || 0,
      fuelType: car.fuel_type || 'Petrol',
      drivetrain: car.drive_type || 'RWD',
      acceleration: car.acceleration || 10,
      topSpeed: car.top_speed_mph ? Math.round(car.top_speed_mph * 1.60934) : 200,
      category: 'Sedan',
      apiSource: 'api-ninjas',
      externalId: `${car.make}-${car.model}-${car.year}`,
    };
  } catch (error) {
    console.error('Error fetching from API-Ninjas:', error.message);
    return null;
  }
};
