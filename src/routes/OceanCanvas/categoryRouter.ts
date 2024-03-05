import express from 'express';
import { Category } from '../../models/OceanCanvas/CategorySchema';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false });

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Categories retrieved successfully.',
      data: categories,
    });
  } catch (error: any) {
    console.log('GetCategories Error: ', error);

    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

router.post('/add', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Category created successfully.',
      data: newCategory,
    });
  } catch (error: any) {
    console.log('AddCategory Error: ', error);

    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

router.put('/edit', async (req, res) => {});

router.put('/delete', async (req, res) => {
  const sizeId = req.body.sizeId;

  try {
    const category = await Category.findOne({ _id: sizeId });

    if (!category) {
      throw new Error('Size not found.');
    }

    category.isDeleted = true;
    await category.save();

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Category deleted successfully.',
    });
  } catch (error: any) {
    console.log('DeleteCategory Error: ', error);

    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

export default router;
