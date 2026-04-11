import express from 'express';

const router = express.Router();

const categoryTags = {
  'Web Development': ['WordPress', 'Landing page', 'SEO', 'Performance'],
  'Graphic Design': ['Branding', 'Logo', 'Social kit', 'Color palette'],
  'Digital Marketing': ['Ads', 'Strategy', 'Analytics', 'Growth'],
  'Video Editing': ['Reels', 'Shorts', 'Subtitles', 'Motion'],
  'Writing & Translation': ['Copywriting', 'Proofreading', 'Urdu', 'English'],
  'AI Services': ['Automation', 'Chatbots', 'Prompting', 'Workflows'],
  Business: ['Pitch deck', 'Research', 'Operations', 'Slides'],
  Finance: ['Modeling', 'Forecast', 'Budgeting', 'Valuation'],
};

// Lightweight AI-style suggestions (heuristic rules)
router.post('/suggest', async (req, res) => {
  const { title = '', description = '', category = 'Web Development', budget } = req.body;
  const keywords = title.split(/\s+/).filter(Boolean);
  const tags = [...new Set([...(categoryTags[category] || []), ...keywords.slice(0, 3)])];

  const basePrice = budget || Math.max(8000, keywords.length * 4000);
  const suggestedDescription =
    description ||
    `I will deliver a premium ${category.toLowerCase()} service focused on trust, clarity, and real business outcomes. You will get a complete handoff, clear milestones, and local-friendly support.`;

  res.json({
    price: basePrice,
    tags,
    description: suggestedDescription,
    deliveryDays: basePrice > 30000 ? 5 : 3,
  });
});

export default router;
