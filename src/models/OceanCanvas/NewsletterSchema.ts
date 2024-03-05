import mongoose from 'mongoose';

const NewsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const oceanCanvasDB = mongoose.connection.useDb('OceanCanvas');

export const Newsletter = oceanCanvasDB.model('Newsletters', NewsletterSchema);
