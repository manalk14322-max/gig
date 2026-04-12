import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Gig from '../models/Gig.js';
import User from '../models/User.js';
import { createOrder as devCreateOrder, findGig as devFindGig, findUserById as devFindUserById, listOrders as devListOrders } from '../lib/devStore.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  if (req.app.locals.dbReady === true) {
    const orders = await Order.find({
      $or: [{ buyerId: req.user.id }, { sellerId: req.user.id }],
    }).sort({ createdAt: -1 });
    return res.json(orders);
  }
  return res.json(devListOrders(req.user.id));
});

router.post('/', requireAuth, async (req, res) => {
  const { gigId } = req.body;
  if (req.app.locals.dbReady === true) {
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ error: 'Gig not found' });
    const buyer = await User.findById(req.user.id);
    if (!buyer) return res.status(401).json({ error: 'Unauthorized' });
    if (!gig.freelancerId) return res.status(400).json({ error: 'Seller not linked to gig' });
    const seller = await User.findById(gig.freelancerId);
    if (!seller) return res.status(400).json({ error: 'Seller not found' });

    const order = await Order.create({
      gigId: gig._id,
      buyerId: buyer._id,
      sellerId: seller._id,
      amount: gig.basePrice,
      deliveryDays: gig.deliveryDays,
      status: 'Placed',
      paymentStatus: 'Pending',
    });
    return res.status(201).json(order);
  }
  const gig = devFindGig(gigId);
  const buyer = devFindUserById(req.user.id);
  if (!gig) return res.status(404).json({ error: 'Gig not found' });
  if (!buyer) return res.status(401).json({ error: 'Unauthorized' });
  const seller = devFindUserById(gig.freelancerId);
  if (!seller) return res.status(400).json({ error: 'Seller not found' });
  const order = devCreateOrder({
    gigId: gig._id,
    buyerId: buyer.id,
    sellerId: seller.id,
    amount: gig.basePrice,
    deliveryDays: gig.deliveryDays,
    status: 'Placed',
    paymentStatus: 'Pending',
  });
  return res.status(201).json(order);
});

export default router;
