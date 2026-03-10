import mongoose from 'mongoose';

const modificationSchema = new mongoose.Schema(
  {
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
    },
    type: {
      type: String,
      enum: ['wheels', 'bodyKit', 'exhaust', 'performance'],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: Number,
    horsepower: Number,
    torque: Number,
    topSpeedImpact: Number,
    imageUrl: String,
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Modification = mongoose.model('Modification', modificationSchema);
