import express from 'express';
import mongoose from 'mongoose';
import Gig from '../models/Gig.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import {
  createGig as devCreateGig,
  createReview as devCreateReview,
  deleteGig as devDeleteGig,
  findGig as devFindGig,
  listGigs as devListGigs,
  listReviews as devListReviews,
  updateGig as devUpdateGig,
  findUserById as devFindUserById,
} from '../lib/devStore.js';

const router = express.Router();

function isObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

// List gigs with optional filters
router.get('/', async (req, res) => {
  const { category, tag, featured } = req.query;
  if (req.app.locals.dbReady === true) {
    const filter = {};
    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (featured === 'true') filter.featured = true;
    const gigs = await Gig.find(filter).sort({ createdAt: -1 }).limit(100);
    return res.json(gigs);
  }
  const gigs = devListGigs({
    category,
    tag,
    featured: featured === 'true',
  });
  return res.json(gigs.slice(0, 100));
});

// Get a single gig + reviews
router.get('/:id', async (req, res) => {
  if (req.app.locals.dbReady === true && !isObjectId(req.params.id)) {
    return res.status(404).json({ error: 'Gig not found' });
  }
  if (req.app.locals.dbReady === true) {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ error: 'Gig not found' });
    const reviews = await Review.find({ gigId: gig._id }).sort({ createdAt: -1 });
    return res.json({ gig, reviews });
  }
  const gig = devFindGig(req.params.id);
  if (!gig) return res.status(404).json({ error: 'Gig not found' });
  const reviews = devListReviews(req.params.id);
  return res.json({ gig, reviews });
});

// Get reviews for a gig
router.get('/:id/reviews', async (req, res) => {
  if (req.app.locals.dbReady === true && !isObjectId(req.params.id)) {
    return res.status(404).json({ error: 'Gig not found' });
  }
  if (req.app.locals.dbReady === true) {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ error: 'Gig not found' });
    const reviews = await Review.find({ gigId: gig._id }).sort({ createdAt: -1 });
    return res.json(reviews);
  }
  const gig = devFindGig(req.params.id);
  if (!gig) return res.status(404).json({ error: 'Gig not found' });
  return res.json(devListReviews(req.params.id));
});

// Create a new gig (video intro required)
router.post('/', requireAuth, async (req, res) => {
  const payload = req.body;
  if (req.app.locals.dbReady === true) {
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
        university: user.university || '',
        universityEmail: user.universityEmail || '',
        department: user.department || '',
        studentId: user.studentId || '',
        verificationStatus: user.verificationStatus || 'pending',
        verifiedStudent: Boolean(user.verifiedStudent || user.verificationStatus === 'verified'),
      },
    });
    return res.status(201).json(gig);
  }
  const user = devFindUserById(req.user.id);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const gig = devCreateGig(payload, user);
  return res.status(201).json(gig);
});

router.put('/:id', requireAuth, async (req, res) => {
  if (req.app.locals.dbReady === true) {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ error: 'Gig not found' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (!gig.freelancerId || gig.freelancerId.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'Not allowed' });
    }
    Object.assign(gig, req.body);
    await gig.save();
    return res.json(gig);
  }
  const gig = devFindGig(req.params.id);
  if (!gig) return res.status(404).json({ error: 'Gig not found' });
  const user = devFindUserById(req.user.id);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  if (gig.freelancerId !== user.id) {
    return res.status(403).json({ error: 'Not allowed' });
  }
  const updated = devUpdateGig(req.params.id, req.body);
  return res.json(updated);
});

router.delete('/:id', requireAuth, async (req, res) => {
  if (req.app.locals.dbReady === true) {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ error: 'Gig not found' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (!gig.freelancerId || gig.freelancerId.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'Not allowed' });
    }
    await gig.deleteOne();
    return res.json({ ok: true });
  }
  const gig = devFindGig(req.params.id);
  if (!gig) return res.status(404).json({ error: 'Gig not found' });
  const user = devFindUserById(req.user.id);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  if (gig.freelancerId !== user.id) {
    return res.status(403).json({ error: 'Not allowed' });
  }
  devDeleteGig(req.params.id);
  return res.json({ ok: true });
});

// Add a review and update rating stats
router.post('/:id/reviews', async (req, res) => {
  if (req.app.locals.dbReady === true && !isObjectId(req.params.id)) {
    return res.status(404).json({ error: 'Gig not found' });
  }
  const gig = req.app.locals.dbReady === true ? await Gig.findById(req.params.id) : devFindGig(req.params.id);
  if (!gig) return res.status(404).json({ error: 'Gig not found' });

  const { reviewer, rating, comment } = req.body;
  if (!reviewer || !comment || !rating) {
    return res.status(400).json({ error: 'Reviewer, rating, and comment are required.' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
  }
  if (req.app.locals.dbReady === true) {
    const review = await Review.create({ gigId: gig._id, reviewer, rating, comment });
    const reviews = await Review.find({ gigId: gig._id });
    const avg = reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;
    gig.ratingAverage = Number(avg.toFixed(2));
    gig.ratingCount = reviews.length;
    await gig.save();
    return res.status(201).json(review);
  }
  const review = devCreateReview(req.params.id, { reviewer, rating, comment });
  return res.status(201).json(review);
});

export default router;
