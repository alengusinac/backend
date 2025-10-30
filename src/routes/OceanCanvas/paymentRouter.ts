import express from 'express';
import Stripe from 'stripe';
import verifyToken from '../../middleware/verifyToken';
import { orderLimiter } from '../../middleware/rateLimiting';

const router = express.Router();

// Initialize Stripe with test keys
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51234567890abcdef', {
  apiVersion: '2025-10-29.clover',
});

// Create payment intent
router.post('/create-payment-intent', orderLimiter, async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid amount provided',
      });
    }

    // Convert amount to cents (Stripe expects amounts in smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency,
      metadata: {
        // Add any additional metadata you need
        orderId: req.body.orderId || '',
      },
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Payment intent created successfully',
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error: any) {
    console.log('CreatePaymentIntent Error: ', error);

    res.status(400).json({
      status: 400,
      message: error.message || 'Failed to create payment intent',
    });
  }
});

// Confirm payment intent (optional - for additional server-side verification)
router.post('/confirm-payment', orderLimiter, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        status: 400,
        message: 'Payment intent ID is required',
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Payment status retrieved successfully',
      data: {
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      },
    });
  } catch (error: any) {
    console.log('ConfirmPayment Error: ', error);

    res.status(400).json({
      status: 400,
      message: error.message || 'Failed to confirm payment',
    });
  }
});

// Webhook endpoint for Stripe events (optional for testing)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret');
  } catch (err: any) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent.id);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('PaymentIntent failed!', failedPayment.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

export default router;
