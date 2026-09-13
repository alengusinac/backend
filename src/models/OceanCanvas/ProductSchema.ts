import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    categories: [String],
    priceMultiplier: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    orientation: {
      type: String,
      enum: ['portrait', 'landscape'],
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const oceanCanvasDB = mongoose.connection.useDb('OceanCanvas');

export const Product = oceanCanvasDB.model('Products', ProductSchema);
