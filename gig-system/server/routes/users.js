import express from 'express';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import Gig from '../models/Gig.js';

const router = express.Router();

// Get current user profile
router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
    location: user.location,
    avatarUrl: user.avatarUrl,
    portfolio: user.portfolio || [],
  });
});

// Update current user profile
router.put('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { name, title, location, avatarUrl, portfolio, role } = req.body;
  if (name) user.name = name;
  if (title !== undefined) user.title = title;
  if (location !== undefined) user.location = location;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
  if (portfolio !== undefined) user.portfolio = portfolio;
  if (role === 'buyer' || role === 'seller') user.role = role;

  await user.save();

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
    location: user.location,
    avatarUrl: user.avatarUrl,
    portfolio: user.portfolio || [],
  });
});

// Public seller profile + gigs
router.get('/:id/public', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const gigs = await Gig.find({ freelancerId: user._id }).sort({ createdAt: -1 });
  res.json({
    seller: {
      id: user._id,
      name: user.name,
      title: user.title,
      location: user.location,
      avatarUrl: user.avatarUrl,
      portfolio: user.portfolio || [],
      role: user.role,
    },
    gigs,
  });
});

export default router;
