import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    // --- بداية التعديل للإصلاح ---
    engine: {
      displacement: { type: Number, required: true },
      cylinders: { type: Number, required: true },
      // هنا يجب كتابة type داخل كائن لتفهم Mongoose أنه حقل وليس نوع بيانات
      type: { type: String, required: true },
    },
    // --- نهاية التعديل ---
    horsepower: {
      type: Number,
      required: true,
    },
    torque: {
      type: Number,
      required: true,
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric'],
      required: true,
    },
    drivetrain: {
      type: String,
      enum: ['RWD', 'FWD', 'AWD', '4WD'],
      required: true,
    },
    acceleration: {
      type: Number,
      description: '0-100 km/h in seconds',
    },
    topSpeed: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    category: {
      type: String,
      enum: ['Sedan', 'SUV', 'Sports', 'Hatchback', 'Coupe', 'Truck'],
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    modificationPotential: {
      wheels: {
        minHorsepower: Number,
        maxHorsepower: Number,
      },
      bodyKit: {
        minHorsepower: Number,
        maxHorsepower: Number,
      },
      exhaust: {
        minHorsepower: Number,
        maxHorsepower: Number,
        torqueBoost: Number,
      },
      performance: {
        minHorsepower: Number,
        maxHorsepower: Number,
        torqueBoost: Number,
      },
    },
    apiSource: {
      type: String,
      default: 'api-ninjas',
    },
    externalId: String,
  },
  {
    timestamps: true,
  }
);

export const Car = mongoose.model('Car', carSchema);