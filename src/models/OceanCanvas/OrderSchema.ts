import mongoose from 'mongoose';
import { AddressSchema } from './AddressSchema';

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    address: {
      type: AddressSchema,
      required: true,
    },
    payment: {
      cardNumber: {
        type: String,
        required: true,
      },
      expirationDate: {
        type: String,
        required: true,
      },
      ccv: {
        type: String,
        required: true,
      },
    },
    products: [
      {
        product: { type: mongoose.SchemaTypes.ObjectId, ref: 'Products', required: true },
        amount: { type: Number, required: true },
      },
    ],
    total: {
      amount: { type: Number, required: true },
      price: { type: Number, required: true },
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const oceanCanvasDB = mongoose.connection.useDb('ocean-canvas');

export const Order = oceanCanvasDB.model('Orders', OrderSchema);
