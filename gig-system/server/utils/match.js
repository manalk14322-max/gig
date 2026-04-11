export function scoreGig(gig, query = '') {
  const text = query.toLowerCase();
  let score = 0;

  if (!text) {
    score += gig.featured ? 6 : 0;
    score += gig.ratingAverage * 2;
    return score;
  }

  const title = (gig.title || '').toLowerCase();
  const description = (gig.description || '').toLowerCase();
  const tags = (gig.tags || []).map((tag) => tag.toLowerCase());

  if (title.includes(text)) score += 12;
  if (description.includes(text)) score += 6;
  tags.forEach((tag) => {
    if (tag.includes(text)) score += 5;
  });

  if (gig.quickTask) score += 2;
  if (gig.featured) score += 4;
  score += gig.ratingAverage * 1.5;
  return score;
}
