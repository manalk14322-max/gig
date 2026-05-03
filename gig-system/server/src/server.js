import 'dotenv/config';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import express from 'express';
import fs from 'fs/promises';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { meResponse, requireAdmin, requireAuth, signToken } from './auth.js';
import { makeId, publicUser, readDb, writeDb } from './db.js';

const app = express();
const port = Number(process.env.PORT || 5050);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = process.env.VERCEL ? path.join('/tmp', 'unihire-uploads') : path.join(__dirname, '..', 'uploads');

const upload = multer({ dest: uploadDir, limits: { fileSize: 5 * 1024 * 1024 } });

app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(uploadDir));

async function ensureSeedData() {
  const db = await readDb();
  const email = process.env.ADMIN_EMAIL || 'admin@unihire.pk';
  if (!db.users.some((user) => user.email === email)) {
    db.users.push({
      id: 'admin-1',
      name: 'UniHire Admin',
      email,
      passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin12345', 10),
      role: 'admin',
      verificationStatus: 'verified',
      verifiedStudent: false,
      cnicVerified: false,
      blocked: false,
      createdAt: new Date().toISOString(),
    });
  }

  if (!db.users.some((user) => user.id === 'seller-demo-1')) {
    db.users.push({
      id: 'seller-demo-1',
      name: 'Ayesha Khan',
      email: 'seller@unihire.pk',
      passwordHash: await bcrypt.hash('seller12345', 10),
      role: 'seller',
      title: 'Verified student web and brand creator',
      location: 'Lahore, Pakistan',
      description: 'FSc+ verified student seller for websites, branding, and content work.',
      skills: ['React', 'Logo Design', 'SEO', 'Urdu Content'],
      portfolio: ['https://behance.net/'],
      university: 'University of the Punjab',
      department: 'Computer Science',
      studentId: 'PU-2026-0142',
      studentLevel: 'BS',
      cnicNumber: '3520212345678',
      verificationStatus: 'verified',
      verifiedStudent: true,
      cnicVerified: true,
      blocked: false,
      responseTime: '1 hour',
      verificationDocs: {},
      verificationHistory: [{ status: 'verified', note: 'Seed seller approved.', decidedAt: new Date().toISOString(), decidedBy: 'UniHire admin' }],
      createdAt: new Date().toISOString(),
    });
  }

  if (!db.gigs.length) {
    const seller = publicUser(db.users.find((user) => user.id === 'seller-demo-1'));
    db.gigs.push(
      {
        _id: 'gig-demo-brand',
        title: 'Design a premium logo and brand kit',
        description: 'Logo, color palette, typography, and social templates for Pakistani small businesses.',
        category: 'Graphics & Design',
        tags: ['logo', 'branding', 'social media'],
        city: 'Lahore',
        studentLevel: 'BS',
        basePrice: 18000,
        deliveryDays: 4,
        quickTask: false,
        quickDeliveryHours: 2,
        services: [{ title: 'Logo starter', price: 12000, durationHours: 24, included: ['2 concepts', 'PNG files'] }],
        requirements: [{ question: 'Brand name', type: 'text', mandatory: true, options: [] }],
        images: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'],
        featured: true,
        approvalStatus: 'approved',
        ratingAverage: 4.9,
        ratingCount: 2,
        responseTime: '1 hour',
        freelancerId: seller.id,
        freelancer: seller,
        createdAt: new Date().toISOString(),
      },
      {
        _id: 'gig-demo-react',
        title: 'Build a responsive React landing page',
        description: 'Mobile-friendly React landing page with sections, CTA, SEO basics, and clean design.',
        category: 'Programming & Tech',
        tags: ['react', 'website', 'frontend', 'seo'],
        city: 'Islamabad',
        studentLevel: 'BS',
        basePrice: 28000,
        deliveryDays: 5,
        quickTask: true,
        quickDeliveryHours: 8,
        services: [{ title: 'Landing page', price: 22000, durationHours: 48, included: ['Hero section', 'Responsive layout'] }],
        requirements: [{ question: 'Page content', type: 'textarea', mandatory: true, options: [] }],
        images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'],
        featured: true,
        approvalStatus: 'approved',
        ratingAverage: 5,
        ratingCount: 1,
        responseTime: '45 min',
        freelancerId: seller.id,
        freelancer: seller,
        createdAt: new Date().toISOString(),
      },
    );
  }
  await writeDb(db);
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'unihire-api' });
});

app.get('/', (req, res) => {
  res.json({ ok: true, service: 'unihire-api', health: '/api/health' });
});

app.post('/api/auth/signup', async (req, res) => {
  const db = await readDb();
  const email = String(req.body.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ error: 'Email is required.' });
  if (db.users.some((user) => user.email === email)) return res.status(409).json({ error: 'Email already exists.' });

  const role = req.body.role === 'seller' ? 'seller' : 'buyer';
  const user = {
    id: makeId('user'),
    name: req.body.name || 'UniHire user',
    email,
    passwordHash: await bcrypt.hash(req.body.password || 'google-demo-password', 10),
    role,
    title: '',
    location: 'Pakistan',
    skills: [],
    portfolio: [],
    verificationStatus: role === 'seller' ? 'pending' : 'verified',
    verifiedStudent: false,
    cnicVerified: false,
    blocked: false,
    verificationDocs: {},
    verificationHistory: [],
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  await writeDb(db);
  res.json({ token: signToken(user), user: publicUser(user), needsVerification: role === 'seller' });
});

app.post('/api/auth/login', async (req, res) => {
  const db = await readDb();
  const email = String(req.body.email || '').trim().toLowerCase();
  const user = db.users.find((item) => item.email === email && !item.blocked);
  if (!user || !(await bcrypt.compare(req.body.password || '', user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
  res.json({ token: signToken(user), user: publicUser(user) });
});

app.post('/api/auth/verify-campus', requireAuth, async (req, res) => {
  const db = await readDb();
  const index = db.users.findIndex((user) => user.id === req.user.id);
  db.users[index] = { ...db.users[index], verificationStatus: 'verified', verifiedStudent: true };
  await writeDb(db);
  res.json({ message: 'Campus account verified.', user: publicUser(db.users[index]) });
});

app.post('/api/auth/resend-campus', requireAuth, (req, res) => {
  res.json({ message: 'Verification OTP sent.' });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json(meResponse(req.user));
});

app.get('/api/users/me', requireAuth, (req, res) => {
  res.json(publicUser(req.user));
});

app.put('/api/users/me', requireAuth, async (req, res) => {
  const db = await readDb();
  const index = db.users.findIndex((user) => user.id === req.user.id);
  const allowed = ['name', 'title', 'location', 'description', 'skills', 'portfolio', 'university', 'universityEmail', 'department', 'studentId', 'studentLevel', 'cnicNumber'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  db.users[index] = { ...db.users[index], ...updates };
  await writeDb(db);
  res.json(publicUser(db.users[index]));
});

app.post('/api/users/verify-request', requireAuth, async (req, res) => {
  const db = await readDb();
  const index = db.users.findIndex((user) => user.id === req.user.id);
  db.users[index] = {
    ...db.users[index],
    verificationStatus: 'pending',
    verificationDocs: { ...req.body, requestedAt: new Date().toISOString() },
  };
  await writeDb(db);
  res.json(publicUser(db.users[index]));
});

app.post('/api/uploads', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'File is required.' });
  res.json({ url: `/uploads/${req.file.filename}`, originalName: req.file.originalname });
});

app.post('/api/ai/suggest', requireAuth, (req, res) => {
  res.json({
    title: req.body.title || 'Professional student service package',
    description: 'Clear scope, timeline, deliverables, and buyer requirements for a trusted UniHire gig.',
    tags: ['pakistan', 'student talent', 'verified seller'],
    price: Number(req.body.budget || 15000),
    deliveryDays: 3,
  });
});

app.get('/api/gigs', async (req, res) => {
  const db = await readDb();
  const featuredOnly = req.query.featured === 'true' || req.query.featured === true;
  const gigs = db.gigs.filter((gig) => {
    if (gig.approvalStatus !== 'approved') return false;
    if (gig.freelancer?.blocked) return false;
    if (featuredOnly && !gig.featured) return false;
    if (req.query.category && gig.category !== req.query.category) return false;
    return true;
  });
  res.json(gigs);
});

app.get('/api/search', async (req, res) => {
  const db = await readDb();
  const q = String(req.query.q || '').toLowerCase();
  const minPrice = Number(req.query.minPrice || 0);
  const maxPrice = Number(req.query.maxPrice || Number.MAX_SAFE_INTEGER);
  const maxDelivery = Number(req.query.maxDelivery || Number.MAX_SAFE_INTEGER);
  const skill = String(req.query.skill || '').toLowerCase();
  const quick = req.query.quick === 'true';
  const results = db.gigs.filter((gig) => {
    if (gig.approvalStatus !== 'approved') return false;
    if (req.query.category && gig.category !== req.query.category) return false;
    if (req.query.city && req.query.city !== 'Any' && gig.city !== req.query.city) return false;
    if (req.query.studentLevel && req.query.studentLevel !== 'Any' && gig.studentLevel !== req.query.studentLevel) return false;
    if (quick && !gig.quickTask) return false;
    if (Number(gig.basePrice) < minPrice || Number(gig.basePrice) > maxPrice) return false;
    if (Number(gig.deliveryDays) > maxDelivery) return false;
    if (skill && !(gig.tags || []).join(' ').toLowerCase().includes(skill)) return false;
    if (!q) return true;
    return `${gig.title} ${gig.description} ${gig.category} ${(gig.tags || []).join(' ')}`.toLowerCase().includes(q);
  });
  res.json({ bestMatch: results[0] || null, results });
});

app.get('/api/gigs/:id', async (req, res) => {
  const db = await readDb();
  const gig = db.gigs.find((item) => item._id === req.params.id);
  if (!gig) return res.status(404).json({ error: 'Gig not found.' });
  res.json({ gig, reviews: db.reviews.filter((review) => review.gigId === gig._id) });
});

app.post('/api/gigs', requireAuth, async (req, res) => {
  if (req.user.role !== 'seller') return res.status(403).json({ error: 'Seller account required.' });
  if (req.user.verificationStatus !== 'verified') return res.status(403).json({ error: 'Verification required before submitting gigs.' });
  const db = await readDb();
  const gig = {
    ...req.body,
    _id: makeId('gig'),
    basePrice: Number(req.body.basePrice || 0),
    deliveryDays: Number(req.body.deliveryDays || 1),
    ratingAverage: 0,
    ratingCount: 0,
    featured: false,
    approvalStatus: 'pending',
    freelancerId: req.user.id,
    freelancer: publicUser(req.user),
    createdAt: new Date().toISOString(),
  };
  db.gigs.unshift(gig);
  await writeDb(db);
  res.json(gig);
});

app.put('/api/gigs/:id', requireAuth, async (req, res) => {
  const db = await readDb();
  const index = db.gigs.findIndex((gig) => gig._id === req.params.id && gig.freelancerId === req.user.id);
  if (index < 0) return res.status(404).json({ error: 'Gig not found.' });
  db.gigs[index] = { ...db.gigs[index], ...req.body, approvalStatus: 'pending', featured: false };
  await writeDb(db);
  res.json(db.gigs[index]);
});

app.delete('/api/gigs/:id', requireAuth, async (req, res) => {
  const db = await readDb();
  const before = db.gigs.length;
  db.gigs = db.gigs.filter((gig) => !(gig._id === req.params.id && (gig.freelancerId === req.user.id || req.user.role === 'admin')));
  if (db.gigs.length === before) return res.status(404).json({ error: 'Gig not found.' });
  await writeDb(db);
  res.json({ ok: true });
});

app.post('/api/orders', requireAuth, async (req, res) => {
  const db = await readDb();
  const gig = db.gigs.find((item) => item._id === req.body.gigId);
  const order = {
    _id: makeId('order'),
    buyerId: req.user.id,
    sellerId: gig?.freelancerId || req.body.sellerId || null,
    ...req.body,
    status: 'Placed',
    paymentStatus: 'Payment pending',
    createdAt: new Date().toISOString(),
  };
  db.orders.unshift(order);
  await writeDb(db);
  res.json(order);
});

app.get('/api/orders', requireAuth, async (req, res) => {
  const db = await readDb();
  const orders = db.orders.filter((order) => order.buyerId === req.user.id || order.sellerId === req.user.id || req.user.role === 'admin');
  res.json(orders);
});

app.post('/api/gigs/:id/reviews', requireAuth, async (req, res) => {
  const db = await readDb();
  const review = {
    _id: makeId('review'),
    gigId: req.params.id,
    reviewer: req.user.name,
    rating: Number(req.body.rating || 5),
    comment: req.body.comment || '',
    createdAt: new Date().toISOString(),
  };
  db.reviews.unshift(review);
  await writeDb(db);
  res.json(review);
});

app.post('/api/payments/easypaisa/init', requireAuth, (req, res) => {
  res.json({ ok: true, provider: 'easypaisa', orderId: req.body.orderId, status: 'not-connected-yet' });
});

app.post('/api/stripe/checkout', requireAuth, (req, res) => {
  res.json({ url: null, message: 'Stripe is not enabled for UniHire Pakistan flow.' });
});

app.post('/api/chats/start', requireAuth, async (req, res) => {
  const db = await readDb();
  const chat = { _id: makeId('chat'), gigId: req.body.gigId, userIds: [req.user.id], messages: [], updatedAt: new Date().toISOString() };
  db.chats.unshift(chat);
  await writeDb(db);
  res.json(chat);
});

app.get('/api/chats', requireAuth, async (req, res) => {
  const db = await readDb();
  res.json(db.chats.filter((chat) => chat.userIds?.includes(req.user.id) || req.user.role === 'admin'));
});

app.post('/api/chats/:id/messages', requireAuth, async (req, res) => {
  const db = await readDb();
  const index = db.chats.findIndex((chat) => chat._id === req.params.id);
  if (index < 0) return res.status(404).json({ error: 'Chat not found.' });
  const message = {
    _id: makeId('message'),
    senderId: req.user.id,
    text: req.body.text || '',
    voiceUrl: req.body.voiceUrl || '',
    createdAt: new Date().toISOString(),
  };
  db.chats[index].messages = [...(db.chats[index].messages || []), message];
  db.chats[index].updatedAt = new Date().toISOString();
  await writeDb(db);
  res.json(message);
});

app.get('/api/users/:id/public', async (req, res) => {
  const db = await readDb();
  const seller = db.users.find((user) => user.id === req.params.id);
  if (!seller) return res.status(404).json({ error: 'Seller not found.' });
  res.json({ seller: publicUser(seller), gigs: db.gigs.filter((gig) => gig.freelancerId === seller.id) });
});

app.get('/api/admin/verification', requireAuth, requireAdmin, async (req, res) => {
  const db = await readDb();
  res.json({
    items: db.users.filter((user) => user.role === 'seller' && user.verificationStatus === 'pending').map(publicUser),
    gigs: db.gigs,
  });
});

app.get('/api/admin/database', requireAuth, requireAdmin, async (req, res) => {
  const db = await readDb();
  res.json({
    counts: {
      users: db.users.length,
      gigs: db.gigs.length,
      orders: db.orders.length,
      reviews: db.reviews.length,
      chats: db.chats.length,
      pendingGigs: db.gigs.filter((gig) => gig.approvalStatus === 'pending').length,
      pendingSellers: db.users.filter((user) => user.role === 'seller' && user.verificationStatus === 'pending').length,
    },
    latest: {
      users: db.users.slice(-5).map(publicUser),
      gigs: db.gigs.slice(0, 5),
      orders: db.orders.slice(0, 5),
    },
  });
});

app.patch('/api/admin/verification/:id', requireAuth, requireAdmin, async (req, res) => {
  const db = await readDb();
  const index = db.users.findIndex((user) => user.id === req.params.id);
  if (index < 0) return res.status(404).json({ error: 'User not found.' });
  db.users[index] = {
    ...db.users[index],
    verificationStatus: req.body.status,
    verifiedStudent: req.body.status === 'verified',
    cnicVerified: req.body.status === 'verified',
    verificationHistory: [
      ...(db.users[index].verificationHistory || []),
      { status: req.body.status, note: req.body.note || '', decidedAt: new Date().toISOString(), decidedBy: req.user.name },
    ],
  };
  await writeDb(db);
  res.json(publicUser(db.users[index]));
});

app.patch('/api/admin/gigs/:id', requireAuth, requireAdmin, async (req, res) => {
  const db = await readDb();
  const index = db.gigs.findIndex((gig) => gig._id === req.params.id);
  if (index < 0) return res.status(404).json({ error: 'Gig not found.' });
  db.gigs[index] = { ...db.gigs[index], approvalStatus: req.body.approvalStatus, featured: req.body.approvalStatus === 'approved' };
  await writeDb(db);
  res.json(db.gigs[index]);
});

app.patch('/api/admin/users/:id/block', requireAuth, requireAdmin, async (req, res) => {
  const db = await readDb();
  const index = db.users.findIndex((user) => user.id === req.params.id);
  if (index < 0) return res.status(404).json({ error: 'User not found.' });
  db.users[index] = { ...db.users[index], blocked: true };
  db.gigs = db.gigs.map((gig) => (gig.freelancerId === req.params.id ? { ...gig, approvalStatus: 'blocked' } : gig));
  await writeDb(db);
  res.json(publicUser(db.users[index]));
});

await ensureSeedData();
await fs.mkdir(uploadDir, { recursive: true });

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`UniHire API running on http://localhost:${port}`);
  });
}

export default app;
