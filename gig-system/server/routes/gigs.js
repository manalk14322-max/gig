import express from 'express';
import Gig from '../models/Gig.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// List gigs with optional filters
router.get('/', async (req, res) => {
  const { category, tag, featured } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (featured === 'true') filter.featured = true;

  const gigs = await Gig.find(filter).sort({ createdAt: -1 }).limit(100);
  res.json(gigs);
});

// Get a single gig + reviews
router.get('/:id', async (req, res) => {
  const gig = await Gig.findById(req.params.id);
  if (!gig) return res.status(404).json({ error: 'Gig not found' });
  const reviews = await Review.find({ gigId: gig._id }).sort({ createdAt: -1 });
  res.json({ gig, reviews });
});

// Create a new gig (video intro required)
router.post('/', requireAuth, async (req, res) => {
  const payload = req.body;
  if (!payload.videoUrl) {
    return res.status(400).json({ error: 'Video intro is required.' });
  }
  const user = await User.findById(req.user.id);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const gig = await Gig.create({
    ...payload,
    freelancerId: user._id,
    freelancer: {
      name: user.name,
      title: user.title || 'Freelancer',
      location: user.location || 'Pakistan',
      avatarUrl: user.avatarUrl || '',
      portfolio: user.portfolio || [],
    },
  });
  res.status(201).json(gig);
});

router.put('/:id', requireAuth, async (req, res) => {
  const gig = await Gig.findById(req.params.id);
  if (!gig) return res.status(404).json({ error: 'Gig not found' });
  const user = await User.findById(req.user.id);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  if (gig.freelancer?.name !== user.name) {
    return res.status(403).json({ error: 'Not allowed' });
  }
  Object.assign(gig, req.body);
  await gig.save();
  res.json(gig);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const gig = await Gig.findById(req.params.id);
  if (!gig) return res.status(404).json({ error: 'Gig not found' });
  const user = await User.findById(req.user.id);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  if (gig.freelancer?.name !== user.name) {
    return res.status(403).json({ error: 'Not allowed' });
  }
  await gig.deleteOne();
  res.json({ ok: true });
});

// Add a review and update rating stats
router.post('/:id/reviews', async (req, res) => {
  const gig = await Gig.findById(req.params.id);
  if (!gig) return res.status(404).json({ error: 'Gig not found' });

  const { reviewer, rating, comment } = req.body;
  const review = await Review.create({ gigId: gig._id, reviewer, rating, comment });

  const reviews = await Review.find({ gigId: gig._id });
  const avg = reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;
  gig.ratingAverage = Number(avg.toFixed(2));
  gig.ratingCount = reviews.length;
  await gig.save();

  res.status(201).json(review);
});

export default router;
