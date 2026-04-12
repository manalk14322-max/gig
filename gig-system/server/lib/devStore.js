import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const dataDir = path.resolve(process.cwd(), 'data');
const storeFile = path.join(dataDir, 'dev-store.json');

function makeId(prefix, number) {
  return `${prefix}-${String(number).padStart(4, '0')}`;
}

function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

function seedStore() {
  const sellerId = 'dev-user-1';
  const buyerId = 'dev-user-2';
  const adminId = 'dev-user-3';
  const gig1 = 'dev-gig-1';
  const gig2 = 'dev-gig-2';
  const gig3 = 'dev-gig-3';

  return {
    users: [
      {
        id: sellerId,
        name: 'Manal Khan',
        email: 'manalk14322@gmail.com',
        passwordHash: hashPassword('Manal1212'),
        role: 'seller',
        title: 'Brand identity & web expert',
        location: 'Lahore, Pakistan',
        avatarUrl: '',
        description: 'Premium seller focused on polished marketplace delivery, strong UX, and local support.',
        skills: ['Branding', 'WordPress', 'UX', 'Figma'],
        portfolio: [
          'https://dribbble.com/shots/branding-portfolio',
          'https://behance.net/portfolio/manal-khan',
        ],
        university: 'University of the Punjab',
        universityEmail: 'manalk14322@gmail.com',
        department: 'Computer Science',
        studentId: 'PU-2026-0142',
        verificationStatus: 'verified',
        verifiedStudent: true,
        verificationDocs: {
          idImage: '',
          selfieImage: '',
          requestedAt: null,
        },
        verificationHistory: [
          { status: 'verified', note: 'Campus verified on signup.', decidedAt: new Date().toISOString(), decidedBy: 'system' },
        ],
      },
      {
        id: buyerId,
        name: 'Ali Raza',
        email: 'buyer@example.com',
        passwordHash: hashPassword('Manal1212'),
        role: 'buyer',
        title: 'Product manager',
        location: 'Karachi, Pakistan',
        avatarUrl: '',
        description: '',
        skills: [],
        portfolio: [],
        university: '',
        universityEmail: '',
        department: '',
        studentId: '',
        verificationStatus: 'pending',
        verifiedStudent: false,
        verificationDocs: {
          idImage: '',
          selfieImage: '',
          requestedAt: null,
        },
        verificationHistory: [],
      },
      {
        id: adminId,
        name: 'Manal Khan',
        email: 'manalk14322@gmail.com',
        passwordHash: hashPassword('Manal1212%%'),
        role: 'admin',
        title: 'Verification lead',
        location: 'Lahore, Pakistan',
        avatarUrl: '',
        description: 'Admin reviewer for student verification requests.',
        skills: [],
        portfolio: [],
        university: '',
        universityEmail: '',
        department: '',
        studentId: '',
        verificationStatus: 'verified',
        verifiedStudent: false,
        verificationDocs: {
          idImage: '',
          selfieImage: '',
          requestedAt: null,
        },
        verificationHistory: [],
      },
    ],
    gigs: [
      {
        _id: gig1,
        title: 'Design a luxury brand identity kit',
        description:
          'Full logo system, color palette, typography, and usage guidelines tailored to Pakistani startups.',
        category: 'Graphics & Design',
        tags: ['branding', 'logo', 'identity', 'luxury'],
        basePrice: 35000,
        deliveryDays: 5,
        quickTask: false,
        quickDeliveryHours: 2,
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
        ratingAverage: 4.9,
        ratingCount: 2,
        freelancerId: sellerId,
        freelancer: {
          name: 'Manal Khan',
          title: 'Brand identity & web expert',
          location: 'Lahore, Pakistan',
          avatarUrl: '',
          portfolio: [
            'https://dribbble.com/shots/branding-portfolio',
            'https://behance.net/portfolio/manal-khan',
          ],
        },
      },
      {
        _id: gig2,
        title: 'Build a bilingual landing page in React',
        description: 'Responsive landing page with Urdu/English toggle, speed optimized, and SEO-ready.',
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
        ratingAverage: 5,
        ratingCount: 1,
        freelancerId: sellerId,
        freelancer: {
          name: 'Manal Khan',
          title: 'Brand identity & web expert',
          location: 'Lahore, Pakistan',
          avatarUrl: '',
          portfolio: [
            'https://dribbble.com/shots/branding-portfolio',
            'https://behance.net/portfolio/manal-khan',
          ],
        },
      },
      {
        _id: gig3,
        title: 'Premium product photos & edits',
        description: 'Studio-grade product photography with retouching and e-commerce ready delivery.',
        category: 'Video & Animation',
        tags: ['product', 'photography', 'ecommerce'],
        basePrice: 22000,
        deliveryDays: 3,
        quickTask: false,
        quickDeliveryHours: 2,
        services: [
          { title: '10 product shots', price: 12000, durationHours: 16, included: ['Retouching', 'White bg'] },
          { title: 'Lifestyle edits', price: 8000, durationHours: 10, included: ['2 scenes', 'Color grading'] },
        ],
        images: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'],
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        featured: false,
        ratingAverage: 4.8,
        ratingCount: 1,
        freelancerId: sellerId,
        freelancer: {
          name: 'Manal Khan',
          title: 'Brand identity & web expert',
          location: 'Lahore, Pakistan',
          avatarUrl: '',
          portfolio: [
            'https://dribbble.com/shots/branding-portfolio',
            'https://behance.net/portfolio/manal-khan',
          ],
        },
      },
    ],
    reviews: [
      { _id: 'dev-review-1', gigId: gig1, reviewer: 'Demo Buyer', rating: 5, comment: 'Super premium brand kit.' },
      { _id: 'dev-review-2', gigId: gig1, reviewer: 'Demo Buyer', rating: 4, comment: 'Great communication.' },
      { _id: 'dev-review-3', gigId: gig2, reviewer: 'Demo Buyer', rating: 5, comment: 'Fast turnaround.' },
    ],
    orders: [],
    nextIds: {
      user: 3,
      gig: 4,
      review: 4,
      order: 1,
    },
  };
}

function normalizeLoadedStore(store) {
  store.users = (store.users || []).map((user) => ({
    university: '',
    universityEmail: '',
    department: '',
    studentId: '',
    verificationStatus: 'pending',
    verifiedStudent: false,
    verificationDocs: {
      idImage: '',
      selfieImage: '',
      requestedAt: null,
    },
    verificationHistory: [],
    ...user,
  }));
  if (!store.users.some((user) => user.role === 'admin')) {
    store.users.push({
      id: makeId('dev-user', store.nextIds.user++),
      name: 'Manal Khan',
      email: 'manalk14322@gmail.com',
      passwordHash: hashPassword('Manal1212%%'),
      role: 'admin',
      title: 'Verification lead',
      location: 'Lahore, Pakistan',
      avatarUrl: '',
      description: 'Admin reviewer for student verification requests.',
      skills: [],
      portfolio: [],
      university: '',
      universityEmail: '',
      department: '',
      studentId: '',
      verificationStatus: 'verified',
      verifiedStudent: false,
      verificationDocs: {
        idImage: '',
        selfieImage: '',
        requestedAt: null,
      },
      verificationHistory: [],
    });
  }
  store.gigs = (store.gigs || []).map((gig) => ({
    ...gig,
    freelancer: gig.freelancer
      ? {
          university: '',
          universityEmail: '',
          department: '',
          studentId: '',
          verificationStatus: 'pending',
          verifiedStudent: false,
          ...gig.freelancer,
        }
      : gig.freelancer,
  }));
  store.reviews = store.reviews || [];
  store.orders = store.orders || [];
  store.nextIds = store.nextIds || { user: 1, gig: 1, review: 1, order: 1 };
  return store;
}

let cachedStore = null;

function ensureStore() {
  if (cachedStore) return cachedStore;
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(storeFile)) {
    cachedStore = seedStore();
    fs.writeFileSync(storeFile, JSON.stringify(cachedStore, null, 2), 'utf8');
    return cachedStore;
  }
  const raw = fs.readFileSync(storeFile, 'utf8');
  cachedStore = normalizeLoadedStore(JSON.parse(raw));
  saveStore();
  return cachedStore;
}

function saveStore() {
  if (!cachedStore) return;
  fs.writeFileSync(storeFile, JSON.stringify(cachedStore, null, 2), 'utf8');
}

export function isDevMode(app) {
  return app?.locals?.dbReady === false;
}

export function getStore() {
  return ensureStore();
}

export function findUserByEmail(email) {
  const store = ensureStore();
  return store.users.find((user) => user.email === email) || null;
}

export function findUserById(id) {
  const store = ensureStore();
  return store.users.find((user) => user.id === id) || null;
}

export function createUser(payload) {
  const store = ensureStore();
    const user = {
      id: makeId('dev-user', store.nextIds.user++),
      name: payload.name,
      email: payload.email,
      passwordHash: payload.passwordHash,
      role: payload.role || 'buyer',
      title: payload.title || '',
      location: payload.location || 'Pakistan',
      avatarUrl: payload.avatarUrl || '',
      description: payload.description || '',
      skills: payload.skills || [],
      portfolio: payload.portfolio || [],
      university: payload.university || '',
      universityEmail: payload.universityEmail || '',
      department: payload.department || '',
      studentId: payload.studentId || '',
      verificationStatus: payload.verificationStatus || 'pending',
      verifiedStudent: payload.verifiedStudent || false,
      verificationDocs: payload.verificationDocs || { idImage: '', selfieImage: '', requestedAt: null },
      verificationHistory: payload.verificationHistory || [],
    };
  store.users.push(user);
  saveStore();
  return user;
}

export function updateUser(id, updates) {
  const store = ensureStore();
  const user = store.users.find((entry) => entry.id === id);
  if (!user) return null;
  Object.assign(user, updates);
  saveStore();
  return user;
}

export function listGigs(filter = {}) {
  const store = ensureStore();
  return store.gigs.filter((gig) => {
    if (filter.featured === true && !gig.featured) return false;
    if (filter.category && gig.category !== filter.category) return false;
    if (filter.quickTask === true && !gig.quickTask) return false;
    if (filter.tag && !(gig.tags || []).includes(filter.tag)) return false;
    if (filter.minPrice !== undefined && gig.basePrice < filter.minPrice) return false;
    if (filter.maxPrice !== undefined && gig.basePrice > filter.maxPrice) return false;
    return true;
  });
}

export function findGig(id) {
  const store = ensureStore();
  return store.gigs.find((gig) => gig._id === id) || null;
}

export function listReviews(gigId) {
  const store = ensureStore();
  return store.reviews.filter((review) => review.gigId === gigId);
}

export function createReview(gigId, review) {
  const store = ensureStore();
  const entry = {
    _id: makeId('dev-review', store.nextIds.review++),
    gigId,
    reviewer: review.reviewer,
    rating: review.rating,
    comment: review.comment,
  };
  store.reviews.push(entry);
  const gig = store.gigs.find((item) => item._id === gigId);
  if (gig) {
    const reviews = store.reviews.filter((item) => item.gigId === gigId);
    gig.ratingCount = reviews.length;
    gig.ratingAverage = reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;
  }
  saveStore();
  return entry;
}

export function createGig(payload, seller) {
  const store = ensureStore();
  const gig = {
    _id: makeId('dev-gig', store.nextIds.gig++),
    title: payload.title,
    description: payload.description,
    category: payload.category,
    tags: payload.tags || [],
    basePrice: Number(payload.basePrice || 0),
    deliveryDays: Number(payload.deliveryDays || 0),
    quickTask: !!payload.quickTask,
    quickDeliveryHours: Number(payload.quickDeliveryHours || 2),
    services: payload.services || [],
    faqs: payload.faqs || [],
    requirements: payload.requirements || [],
    images: payload.images || [],
    videoUrl: payload.videoUrl,
    featured: !!payload.featured,
    ratingAverage: 0,
    ratingCount: 0,
    freelancerId: seller.id,
    freelancer: {
      name: seller.name,
      title: seller.title,
      location: seller.location,
      avatarUrl: seller.avatarUrl || '',
      university: seller.university || '',
      universityEmail: seller.universityEmail || '',
      department: seller.department || '',
      studentId: seller.studentId || '',
      verificationStatus: seller.verificationStatus || 'pending',
      verifiedStudent: seller.verifiedStudent || false,
      portfolio: seller.portfolio || [],
    },
  };
  store.gigs.unshift(gig);
  saveStore();
  return gig;
}

export function updateGig(id, updates) {
  const store = ensureStore();
  const gig = store.gigs.find((item) => item._id === id);
  if (!gig) return null;
  Object.assign(gig, updates);
  saveStore();
  return gig;
}

export function deleteGig(id) {
  const store = ensureStore();
  const index = store.gigs.findIndex((item) => item._id === id);
  if (index === -1) return false;
  store.gigs.splice(index, 1);
  saveStore();
  return true;
}

export function searchGigs(query = {}) {
  const q = (query.q || '').toLowerCase();
  const category = query.category;
  const quick = query.quick === true;
  const minPrice = query.minPrice;
  const maxPrice = query.maxPrice;

  const results = listGigs({
    category,
    quickTask: quick || undefined,
    minPrice,
    maxPrice,
  }).map((gig) => {
    let score = 0;
    if (!q) return { gig, score };
    const haystack = `${gig.title} ${gig.description} ${(gig.tags || []).join(' ')} ${gig.category}`.toLowerCase();
    q.split(/\s+/).forEach((term) => {
      if (!term) return;
      if (haystack.includes(term)) score += 10;
    });
    return { gig, score };
  });

  results.sort((a, b) => b.score - a.score);
  return {
    bestMatch: results[0]?.gig || null,
    results: results.map((entry) => entry.gig),
  };
}

export function listOrders(userId) {
  const store = ensureStore();
  return store.orders.filter((order) => order.buyerId === userId || order.sellerId === userId);
}

export function createOrder(payload) {
  const store = ensureStore();
  const order = {
    _id: makeId('dev-order', store.nextIds.order++),
    gigId: payload.gigId,
    buyerId: payload.buyerId,
    sellerId: payload.sellerId,
    status: payload.status || 'Placed',
    amount: payload.amount || 0,
    deliveryDays: payload.deliveryDays || 0,
    paymentStatus: payload.paymentStatus || 'Pending',
  };
  store.orders.unshift(order);
  saveStore();
  return order;
}
