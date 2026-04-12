import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import { findGig as devFindGig, createOrder as devCreateOrder, findUserById as devFindUserById } from '../lib/devStore.js';

const router = express.Router();

// Easypaisa stub init
router.post('/easypaisa/init', requireAuth, async (req, res) => {
  const { orderId } = req.body;
  if (req.app.locals.dbReady === true) {
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

    return res.json({
      paymentId: payment._id,
      reference,
      redirectUrl,
    });
  }

  return res.json({
    paymentId: `dev-payment-${Date.now()}`,
    reference: `EP-${Date.now()}`,
    redirectUrl: 'https://easypaisa.example.com/pay?ref=demo',
  });
});

// Easypaisa callback stub
router.post('/easypaisa/callback', async (req, res) => {
  const { reference, status = 'Success' } = req.body;
  if (req.app?.locals?.dbReady === true) {
    const payment = await Payment.findOne({ reference });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    payment.status = status;
    await payment.save();
    return res.json({ ok: true });
  }
  return res.json({ ok: true });
});

export default router;
