export const recommendCars = (cars, userPreferences) => {
  const {
    performanceLevel = 'medium',
    engineType = null,
    drivingStyle = 'balanced',
    modificationInterest = 'medium',
  } = userPreferences;

  return cars
    .map((car) => {
      let score = 0;
      let reasons = [];

      // Performance scoring
      const performanceMap = {
        low: { minHp: 0, maxHp: 150 },
        medium: { minHp: 150, maxHp: 300 },
        high: { minHp: 300, maxHp: 500 },
        extreme: { minHp: 500, maxHp: 10000 },
      };

      const perfRange = performanceMap[performanceLevel];
      if (car.horsepower >= perfRange.minHp && car.horsepower <= perfRange.maxHp) {
        score += 30;
        reasons.push('Perfect performance match');
      } else if (
        car.horsepower >= perfRange.minHp - 50 &&
        car.horsepower <= perfRange.maxHp + 50
      ) {
        score += 15;
        reasons.push('Good performance match');
      }

      // Engine type preference
      if (engineType) {
        if (car.fuelType.toLowerCase() === engineType.toLowerCase()) {
          score += 20;
          reasons.push(`Matches ${engineType} preference`);
        }
      }

      // Driving style scoring
      if (drivingStyle === 'performance') {
        if (car.horsepower > 300) {
          score += 20;
          reasons.push('Excellent for performance driving');
        }
        if (car.acceleration < 7) {
          score += 15;
          reasons.push('Quick acceleration');
        }
      } else if (drivingStyle === 'luxury') {
        score += 10;
        reasons.push('Great overall balance');
      } else if (drivingStyle === 'efficiency') {
        if (car.fuelType === 'Hybrid' || car.fuelType === 'Electric') {
          score += 25;
          reasons.push('Excellent fuel efficiency');
        }
      }

      // Modification potential
      if (modificationInterest === 'high' && car.horsepower < 400) {
        score += 20;
        reasons.push('High modification potential');
      } else if (modificationInterest === 'medium') {
        score += 10;
        reasons.push('Good customization options');
      }

      // Top speed bonus
      if (car.topSpeed > 250) {
        score += 10;
        reasons.push('Impressive top speed');
      }

      // Category bonus
      const preferredCategories = {
        performance: ['Sports', 'Coupe'],
        luxury: ['Sedan', 'Coupe'],
        efficiency: ['Hatchback', 'Sedan'],
        adventure: ['SUV', 'Truck'],
      };

      if (preferredCategories[drivingStyle]?.includes(car.category)) {
        score += 15;
        reasons.push(`Popular ${car.category} in this segment`);
      }

      return {
        car,
        score,
        reasons: reasons.slice(0, 3),
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
};

export const getRecommendationExplanation = (car, score, reasons) => {
  return {
    carName: `${car.brand} ${car.model}`,
    matchScore: Math.min(100, score),
    topReasons: reasons,
    specs: {
      horsepower: car.horsepower,
      topSpeed: car.topSpeed,
      acceleration: car.acceleration,
      fuelType: car.fuelType,
      drivetrain: car.drivetrain,
    },
  };
};
