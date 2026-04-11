import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';

const router = express.Router();

// Easypaisa stub init
router.post('/easypaisa/init', requireAuth, async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const reference = `EP-${Date.now()}`;
  const redirectUrl = `https://easypaisa.example.com/pay?ref=${reference}`;

  const payment = await Payment.create({
    orderId: order._id,
    provider: 'easypaisa',
    status: 'Initiated',
    amount: order.amount,
    reference,
    redirectUrl,
    meta: {
      merchantId: process.env.EASYPAYSA_MERCHANT_ID || 'YOUR_MERCHANT_ID',
      storeId: process.env.EASYPAYSA_STORE_ID || 'YOUR_STORE_ID',
    },
  });

  res.json({
    paymentId: payment._id,
    reference,
    redirectUrl,
  });
});

// Easypaisa callback stub
router.post('/easypaisa/callback', async (req, res) => {
  const { reference, status = 'Success' } = req.body;
  const payment = await Payment.findOne({ reference });
  if (!payment) return res.status(404).json({ error: 'Payment not found' });
  payment.status = status;
  await payment.save();
  res.json({ ok: true });
});

export default router;
