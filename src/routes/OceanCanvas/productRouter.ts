import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { Product } from '../../models/OceanCanvas/ProductSchema';
import { Size } from '../../models/OceanCanvas/SizeSchema';
import { Types } from 'mongoose';
import { log } from 'console';

const router = express.Router();

interface IFindProductQuery {
  categories?: string;
  isDeleted: boolean;
}

router.get('/', async (req, res) => {
  try {
    let query: IFindProductQuery = { isDeleted: false };
    const categories = req.query.category as string;
    const sort = req.query.sort as string;

    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 0;
    categories && (query = { ...query, categories });

    const products = await Product.find(query).limit(Number(limit)).skip(Number(offset)).sort(sort);
    const totalProducts = await Product.countDocuments(query);
    const sizes = await Size.find();

    const productsWithPrizes = products.map((product) => {
      const { _id, title, description, categories, priceMultiplier, imageUrl, createdAt } = product;

      const newProduct = {
        _id,
        title,
        description,
        priceMultiplier,
        categories,
        imageUrl,
        createdAt,
        sizes: sizes.map((size) => ({
          _id: size._id,
          size: `${size.width}x${size.height}`,
          price: size.price * priceMultiplier,
        })),
      };

      return newProduct;
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Products retrieved successfully.',
      data: { total: totalProducts, products: productsWithPrizes },
    });
  } catch (error: any) {
    console.log('GetProducts Error: ', error);

    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

router.post('/add', async (req, res) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  let imageUrl: string = '';

  try {
    await cloudinary.uploader.upload(req.body.image, { public_id: req.body.title }, function (error, result) {
      result ? (imageUrl = result?.secure_url) : '';
    });

    const newProduct = await Product.create({
      title: req.body.title,
      description: req.body.description,
      categories: req.body.categories,
      priceMultiplier: req.body.priceMultiplier,
      imageUrl: imageUrl,
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Product created successfully.',
      product: newProduct,
    });
  } catch (error: any) {
    console.log('AddProduct Error: ', error);

    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

router.put('/edit', async (req, res) => {});

router.put('/delete', async (req, res) => {
  const productId = req.body.productId;

  try {
    const product = await Product.findOne({ _id: productId });

    if (!product) {
      throw new Error('Product not found.');
    }

    product.isDeleted = true;
    await product.save();

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error: any) {
    console.log('DeleteProduct Error: ', error);

    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    const sizes = await Size.find();

    if (!product) {
      throw new Error('Product not found.');
    }

    const { _id, title, description, categories, priceMultiplier, imageUrl, createdAt } = product;
    const newProduct = {
      _id,
      title,
      description,
      categories,
      imageUrl,
      createdAt,
      sizes: sizes.map((size) => ({
        _id: size._id,
        size: `${size.width}x${size.height}`,
        price: size.price * priceMultiplier,
      })),
    };

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Product retrieved successfully.',
      data: newProduct,
    });
  } catch (error: any) {
    console.log('GetProduct Error: ', error);

    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

export default router;
