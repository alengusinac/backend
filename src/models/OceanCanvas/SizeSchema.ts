import mongoose from 'mongoose';

const SizeSchema = new mongoose.Schema({
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  price: { type: Number, required: true },
  isDeleted: { type: Boolean, default: false },
});

const oceanCanvasDB = mongoose.connection.useDb('ocean-canvas');

export const Size = oceanCanvasDB.model('Sizes', SizeSchema);
