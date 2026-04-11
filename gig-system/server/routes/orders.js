import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Gig from '../models/Gig.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const orders = await Order.find({
    $or: [{ buyerId: req.user.id }, { sellerId: req.user.id }],
  }).sort({ createdAt: -1 });
  res.json(orders);
});

router.post('/', requireAuth, async (req, res) => {
  const { gigId } = req.body;
  const gig = await Gig.findById(gigId);
  if (!gig) return res.status(404).json({ error: 'Gig not found' });
  const buyer = await User.findById(req.user.id);
  if (!buyer) return res.status(401).json({ error: 'Unauthorized' });
  const seller = await User.findOne({ name: gig.freelancer?.name });
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
  res.status(201).json(order);
});

export default router;
