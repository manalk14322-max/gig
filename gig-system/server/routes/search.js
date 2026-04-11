import express from 'express';
import Gig from '../models/Gig.js';
import { scoreGig } from '../utils/match.js';

const router = express.Router();

// Smart search with basic relevance scoring and best match
router.get('/', async (req, res) => {
  const { q = '', category, quick, minPrice, maxPrice, tag } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (quick === 'true') filter.quickTask = true;
  if (minPrice || maxPrice) {
    filter.basePrice = {};
    if (minPrice) filter.basePrice.$gte = Number(minPrice);
    if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
  }

  const gigs = await Gig.find(filter);
  const scored = gigs
    .map((gig) => ({ gig, score: scoreGig(gig, q) }))
    .sort((a, b) => b.score - a.score);

  const bestMatch = scored[0]?.gig || null;

  res.json({
    bestMatch,
    results: scored.map((entry) => entry.gig),
  });
});

export default router;
