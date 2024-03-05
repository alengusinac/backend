import express from 'express';
import { Order } from '../../models/OceanCanvas/OrderSchema';
import ShortUniqueId from 'short-unique-id';
import verifyToken from '../../middleware/verifyToken';
import { sendEmail } from '../../services/emailService';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    if (!orders) {
      throw new Error('Orders not found.');
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Orders fetched successfully.',
      data: orders,
    });
  } catch (error: any) {
    console.log('GetOrders Error: ', error);

    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

router.get('/user', verifyToken, async (req: any, res) => {
  try {
    const orders = await Order.find({ user: req.userId });
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Orders fetched successfully.',
      data: orders,
    });
  } catch (error: any) {
    console.log('UserOrders Error: ', error);

    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

router.post('/add', async (req, res) => {
  const uid = new ShortUniqueId();
  const orderNumber = uid.randomUUID(6);
  const query = { ...req.body, orderNumber };

  try {
    const order = await Order.create(query);

    if (!order) {
      throw new Error('Order not created.');
    }

    const emailData = {
      from: 'OceanCanvas',
      to: order.address.email ? order.address.email : '',
      subject: 'Order Confirmation',
      text: `Your order has been placed successfully. Your order number is ${order.orderNumber}.`,
    };

    sendEmail(emailData);

    res.status(201).json({
      status: 201,
      success: true,
      message: 'Order created successfully.',
      data: order,
    });
  } catch (error: any) {
    console.log('AddOrder Error: ', error);

    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

router.put('/edit', async (req, res) => {});

router.put('/delete', async (req, res) => {});

export default router;
