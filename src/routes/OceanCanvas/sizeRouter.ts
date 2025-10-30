import express from 'express';
import { Size } from '../../models/OceanCanvas/SizeSchema';
import verifyAdmin from '../../middleware/verifyAdmin';
import { adminLimiter, generalLimiter } from '../../middleware/rateLimiting';

const router = express.Router();

router.get('/', generalLimiter, async (req, res) => {
  try {
    const sizes = await Size.find({ isDeleted: false });

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Sizes retrieved successfully.',
      data: sizes,
    });
  } catch (error: any) {
    console.log('GetSizes Error: ', error);

    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

router.post('/add', adminLimiter, verifyAdmin, async (req, res) => {
  try {
    const newSize = await Size.create(req.body);

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Size created successfully.',
      data: newSize,
    });
  } catch (error: any) {
    console.log('AddSize Error: ', error);

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
    const size = await Size.findOne({ _id: sizeId });

    if (!size) {
      throw new Error('Size not found.');
    }

    size.isDeleted = true;
    await size.save();

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Size deleted successfully.',
    });
  } catch (error: any) {
    console.log('DeleteSize Error: ', error);

    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

export default router;
