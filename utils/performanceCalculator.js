export const calculateModificationImpact = (baseCar, modifications) => {
  let totalHorsepower = baseCar.horsepower || 0;
  let totalTorque = baseCar.torque || 0;
  let totalPrice = 0;
  let totalTopSpeedIncrease = 0;

  const modTypes = {
    wheels: {
      hpBoost: 10,
      torqueBoost: 5,
      topSpeedIncrease: 5,
      basePrice: 2000,
    },
    bodyKit: {
      hpBoost: 15,
      torqueBoost: 10,
      topSpeedIncrease: 8,
      basePrice: 3000,
    },
    exhaust: {
      hpBoost: 20,
      torqueBoost: 25,
      topSpeedIncrease: 10,
      basePrice: 1500,
    },
    performance: {
      hpBoost: 40,
      torqueBoost: 50,
      topSpeedIncrease: 15,
      basePrice: 5000,
    },
  };

  modifications.forEach((mod) => {
    if (modTypes[mod]) {
      totalHorsepower += modTypes[mod].hpBoost;
      totalTorque += modTypes[mod].torqueBoost;
      totalPrice += modTypes[mod].basePrice;
      totalTopSpeedIncrease += modTypes[mod].topSpeedIncrease;
    }
  });

  const newAcceleration = Math.max(
    2,
    baseCar.acceleration - (totalHorsepower - baseCar.horsepower) / 50
  );

  return {
    baseHorsepower: baseCar.horsepower,
    modifiedHorsepower: totalHorsepower,
    horsepowergain: totalHorsepower - baseCar.horsepower,
    baseTorque: baseCar.torque,
    modifiedTorque: totalTorque,
    torqueGain: totalTorque - baseCar.torque,
    baseTopSpeed: baseCar.topSpeed,
    modifiedTopSpeed: baseCar.topSpeed + totalTopSpeedIncrease,
    topSpeedIncrease: totalTopSpeedIncrease,
    baseAcceleration: baseCar.acceleration,
    modifiedAcceleration: newAcceleration,
    accelerationImprovement: baseCar.acceleration - newAcceleration,
    totalPrice: totalPrice,
    modifications: modifications,
  };
};
