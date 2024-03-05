import mongoose from 'mongoose';
import { AddressSchema } from './AddressSchema';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: AddressSchema,
    orders: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Orders' }],
    admin: {
      type: Boolean,
      default: false,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const oceanCanvasDB = mongoose.connection.useDb('ocean-canvas');

export const User = oceanCanvasDB.model('Users', UserSchema);
