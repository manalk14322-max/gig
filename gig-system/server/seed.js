import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Gig from './models/Gig.js';
import Review from './models/Review.js';

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, { autoIndex: true });

  const passwordHash = await bcrypt.hash('Password123!', 10);

  const seller = await User.findOneAndUpdate(
    { email: 'manal.khan@example.com' },
    {
      name: 'Manal Khan',
      email: 'manal.khan@example.com',
      passwordHash,
      role: 'seller',
      title: 'Brand identity & web expert',
      location: 'Lahore, Pakistan',
      avatarUrl: '',
      portfolio: [
        'https://dribbble.com/shots/branding-portfolio',
        'https://behance.net/portfolio/manal-khan',
      ],
    },
    { new: true, upsert: true },
  );

  await User.findOneAndUpdate(
    { email: 'buyer@example.com' },
    {
      name: 'Ali Raza',
      email: 'buyer@example.com',
      passwordHash,
      role: 'buyer',
      title: 'Product manager',
      location: 'Karachi, Pakistan',
    },
    { new: true, upsert: true },
  );

  await Review.deleteMany({ reviewer: /Demo Buyer/i });
  await Gig.deleteMany({ freelancerId: seller._id });

  const gigs = await Gig.insertMany([
    {
      title: 'Design a luxury brand identity kit',
      description:
        'Full logo system, color palette, typography, and usage guidelines tailored to Pakistani startups.',
      category: 'Graphics & Design',
      tags: ['branding', 'logo', 'identity', 'luxury'],
      basePrice: 35000,
      deliveryDays: 5,
      quickTask: false,
      services: [
        { title: 'Primary logo concepts', price: 18000, durationHours: 24, included: ['2 concepts', 'AI + EPS'] },
        { title: 'Social media kit', price: 9000, durationHours: 12, included: ['5 templates', 'Story covers'] },
        { title: 'Brand guidebook', price: 8000, durationHours: 10, included: ['Usage rules', 'Color specs'] },
      ],
      images: [
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
      ],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      featured: true,
      freelancerId: seller._id,
      freelancer: {
        name: seller.name,
        title: seller.title,
        location: seller.location,
        avatarUrl: seller.avatarUrl,
        portfolio: seller.portfolio,
      },
    },
    {
      title: 'Build a bilingual landing page in React',
      description:
        'Responsive landing page with Urdu/English toggle, speed optimized, and SEO-ready.',
      category: 'Programming & Tech',
      tags: ['react', 'landing page', 'urdu', 'seo'],
      basePrice: 28000,
      deliveryDays: 4,
      quickTask: true,
      quickDeliveryHours: 2,
      services: [
        { title: 'Hero + CTA section', price: 9000, durationHours: 8, included: ['Copy polish', 'CTA design'] },
        { title: 'Responsive layout', price: 7000, durationHours: 6, included: ['Mobile first', 'Tablet ready'] },
        { title: 'SEO meta setup', price: 6000, durationHours: 4, included: ['Meta tags', 'OG image'] },
      ],
      images: [
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?2',
      ],
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
      featured: true,
      freelancerId: seller._id,
      freelancer: {
        name: seller.name,
        title: seller.title,
        location: seller.location,
        avatarUrl: seller.avatarUrl,
        portfolio: seller.portfolio,
      },
    },
    {
      title: 'Premium product photos & edits',
      description:
        'Studio-grade product photography with retouching and e-commerce ready delivery.',
      category: 'Video & Animation',
      tags: ['product', 'photography', 'ecommerce'],
      basePrice: 22000,
      deliveryDays: 3,
      quickTask: false,
      services: [
        { title: '10 product shots', price: 12000, durationHours: 16, included: ['Retouching', 'White bg'] },
        { title: 'Lifestyle edits', price: 8000, durationHours: 10, included: ['2 scenes', 'Color grading'] },
      ],
      images: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      featured: false,
      freelancerId: seller._id,
      freelancer: {
        name: seller.name,
        title: seller.title,
        location: seller.location,
        avatarUrl: seller.avatarUrl,
        portfolio: seller.portfolio,
      },
    },
  ]);

  const reviews = await Review.insertMany([
    {
      gigId: gigs[0]._id,
      reviewer: 'Demo Buyer',
      rating: 5,
      comment: 'Super premium brand kit, exactly the luxury feel we needed.',
    },
    {
      gigId: gigs[0]._id,
      reviewer: 'Demo Buyer',
      rating: 4,
      comment: 'Great communication and polished deliverables.',
    },
    {
      gigId: gigs[1]._id,
      reviewer: 'Demo Buyer',
      rating: 5,
      comment: 'Fast turnaround and the Urdu layout looks beautiful.',
    },
  ]);

  for (const gig of gigs) {
    const gigReviews = reviews.filter((review) => review.gigId.toString() === gig._id.toString());
    if (!gigReviews.length) continue;
    const total = gigReviews.reduce((sum, review) => sum + review.rating, 0);
    gig.ratingCount = gigReviews.length;
    gig.ratingAverage = total / gigReviews.length;
    await gig.save();
  }

  console.log('Seed complete. Seller:', seller.name);
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error('Seed failed', error);
  process.exit(1);
});
