import express from 'express';
import Stripe from 'stripe';
import { requireAuth } from '../middleware/auth.js';
import Order from '../models/Order.js';

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

router.post('/checkout', requireAuth, async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ error: 'Order ID required' });

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(400).json({ error: 'Stripe is not configured' });
  }

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'pkr',
          product_data: { name: `Gig Order ${order._id.toString().slice(-6)}` },
          unit_amount: Math.round(order.amount * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders?success=true`,
    cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders?canceled=true`,
  });

  order.paymentStatus = 'Processing';
  await order.save();

  res.json({ url: session.url });
});

export default router;
