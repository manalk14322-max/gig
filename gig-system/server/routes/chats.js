import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import Conversation from '../models/Conversation.js';
import Gig from '../models/Gig.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const conversations = await Conversation.find({
    $or: [{ buyerId: req.user.id }, { sellerId: req.user.id }],
  }).sort({ updatedAt: -1 });
  res.json(conversations);
});

router.post('/start', requireAuth, async (req, res) => {
  const { gigId } = req.body;
  const gig = await Gig.findById(gigId);
  if (!gig) return res.status(404).json({ error: 'Gig not found' });
  const buyer = await User.findById(req.user.id);
  if (!gig.freelancerId) return res.status(400).json({ error: 'Seller not linked to gig' });
  const seller = await User.findById(gig.freelancerId);
  if (!buyer || !seller) return res.status(400).json({ error: 'Missing users' });

  const existing = await Conversation.findOne({ gigId: gig._id, buyerId: buyer._id, sellerId: seller._id });
  if (existing) return res.json(existing);

  const conversation = await Conversation.create({
    gigId: gig._id,
    buyerId: buyer._id,
    sellerId: seller._id,
    messages: [],
  });
  res.status(201).json(conversation);
});

router.post('/:id/messages', requireAuth, async (req, res) => {
  const { text } = req.body;
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
  conversation.messages.push({ senderId: req.user.id, text });
  await conversation.save();
  res.status(201).json(conversation);
});

export default router;
