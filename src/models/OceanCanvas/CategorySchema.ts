import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
});

const oceanCanvasDB = mongoose.connection.useDb('ocean-canvas');

export const Category = oceanCanvasDB.model('Categories', CategorySchema);
