import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    country: String,
    logoUrl: String,
    description: String,
    website: String,
  },
  {
    timestamps: true,
  }
);

export const Brand = mongoose.model('Brand', brandSchema);
