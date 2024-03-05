import mongoose from 'mongoose';

const BookingsSchema = new mongoose.Schema({
  shortId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  date: { type: String, required: true },
  amount: { type: Number, required: true },
  table: { type: Number, required: true },
  sitting: { type: Number, required: true },
  isDeleted: { type: Boolean, default: false },
});

const melissaDB = mongoose.connection.useDb('melissa');

export const Booking = melissaDB.model('bookings', BookingsSchema);
