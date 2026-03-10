import mongoose from 'mongoose';

const configurationSchema = new mongoose.Schema(
  {
    userId: String,
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    modifications: {
      wheels: mongoose.Schema.Types.ObjectId,
      bodyKit: mongoose.Schema.Types.ObjectId,
      exhaust: mongoose.Schema.Types.ObjectId,
      performance: mongoose.Schema.Types.ObjectId,
    },
    totalPrice: Number,
    performanceStats: {
      horsepower: Number,
      torque: Number,
      topSpeed: Number,
      acceleration: Number,
    },
    visualizationUrl: String,
  },
  {
    timestamps: true,
  }
);

export const Configuration = mongoose.model('Configuration', configurationSchema);
