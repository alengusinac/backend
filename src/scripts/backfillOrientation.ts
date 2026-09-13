import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { Product } from '../models/OceanCanvas/ProductSchema';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function extractPublicId(imageUrl: string): string | null {
  const match = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+(?:\?.*)?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

async function backfillOrientation() {
  await mongoose.connect(process.env.DB_HOST || '');
  console.log('Connected to DB.');

  const products = await Product.find({ orientation: { $exists: false } });
  console.log(`Found ${products.length} products missing orientation.`);

  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    const publicId = extractPublicId(product.imageUrl);

    if (!publicId) {
      console.log(`[SKIP] Could not parse public_id from URL for "${product.title}" (${product._id}): ${product.imageUrl}`);
      skipped++;
      continue;
    }

    try {
      const resource = await cloudinary.api.resource(publicId);
      const orientation = resource.height > resource.width ? 'portrait' : 'landscape';

      product.orientation = orientation;
      await product.save();

      console.log(`[OK] "${product.title}" (${product._id}) -> ${orientation} (${resource.width}x${resource.height})`);
      updated++;
    } catch (error: any) {
      console.log(`[SKIP] Cloudinary lookup failed for "${product.title}" (${product._id}, public_id="${publicId}"): ${error.message}`);
      skipped++;
    }
  }

  console.log(`Done. Updated: ${updated}, Skipped: ${skipped}, Total: ${products.length}`);
  await mongoose.disconnect();
}

backfillOrientation().catch((error) => {
  console.log('Backfill failed:', error);
  process.exit(1);
});
