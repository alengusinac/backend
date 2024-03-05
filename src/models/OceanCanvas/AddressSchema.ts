import mongoose from 'mongoose';

export const AddressSchema = new mongoose.Schema({
  email: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  address: { type: String },
  zipcode: { type: String },
  city: { type: String },
  country: { type: String },
  phone: { type: String },
});
