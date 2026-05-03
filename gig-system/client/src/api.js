import axios from 'axios';
import { demoChats, demoGigs, demoOrders, demoReviews, demoUser } from './demoData.js';

const TOKEN_KEY = 'gig.token';
const USER_KEY = 'gig.demoUser';
const GIGS_KEY = 'gig.demoGigs';
const ORDERS_KEY = 'gig.demoOrders';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function readJson(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

function getDemoUser() {
  return readJson(USER_KEY, demoUser);
}

function setDemoUser(user) {
  return writeJson(USER_KEY, user);
}

function getDemoGigs() {
  return readJson(GIGS_KEY, demoGigs);
}

function setDemoGigs(gigs) {
  return writeJson(GIGS_KEY, gigs);
}

function getDemoOrders() {
  return readJson(ORDERS_KEY, demoOrders);
}

function setDemoOrders(orders) {
  return writeJson(ORDERS_KEY, orders);
}

function demoSearch(params = {}) {
  const q = String(params.q || '').toLowerCase();
  const minPrice = Number(params.minPrice || 0);
  const maxPrice = Number(params.maxPrice || Number.MAX_SAFE_INTEGER);
  const quickOnly = params.quick === 'true' || params.quick === true;
  const maxDelivery = Number(params.maxDelivery || Number.MAX_SAFE_INTEGER);
  const skill = String(params.skill || '').toLowerCase();

  const results = getDemoGigs()
    .filter((gig) => {
      if ((gig.approvalStatus || 'approved') !== 'approved') return false;
      if (gig.freelancer?.blocked) return false;
      if (params.featured && !gig.featured) return false;
      if (params.category && gig.category !== params.category) return false;
      if (params.city && params.city !== 'Any' && gig.city !== params.city) return false;
      if (params.studentLevel && params.studentLevel !== 'Any' && gig.studentLevel !== params.studentLevel) return false;
      if (quickOnly && !gig.quickTask) return false;
      if (gig.basePrice < minPrice || gig.basePrice > maxPrice) return false;
      if (Number(gig.deliveryDays || 0) > maxDelivery) return false;
      if (skill && !(gig.tags || []).join(' ').toLowerCase().includes(skill)) return false;
      if (!q) return true;

      const haystack = `${gig.title} ${gig.description} ${gig.category} ${(gig.tags || []).join(' ')}`.toLowerCase();
      return haystack.includes(q);
    })
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.ratingAverage - a.ratingAverage);

  return {
    bestMatch: results[0] || null,
    results,
  };
}

async function withFallback(request, fallback) {
  try {
    const response = await request();
    return response.data;
  } catch {
    return typeof fallback === 'function' ? fallback() : fallback;
  }
}

export const fetchGigs = (params) =>
  withFallback(() => api.get('/gigs', { params }), () => demoSearch(params).results);

export const fetchGig = (id) =>
  withFallback(
    () => api.get(`/gigs/${id}`),
    () => {
      const gig = getDemoGigs().find((item) => item._id === id) || getDemoGigs()[0];
      return {
        gig,
        reviews: demoReviews.filter((review) => review.gigId === gig?._id),
      };
    },
  );

export const createGig = (payload) =>
  withFallback(
    () => api.post('/gigs', payload),
    () => {
      const user = getDemoUser();
      const gig = {
        ...payload,
        _id: `demo-gig-${Date.now()}`,
        basePrice: Number(payload.basePrice || 0),
        deliveryDays: Number(payload.deliveryDays || 1),
        quickTask: Boolean(payload.quickTask),
        featured: false,
        approvalStatus: 'pending',
        city: payload.city || user.location?.split(',')[0] || 'Online',
        studentLevel: user.studentLevel || 'FSc',
        ratingAverage: 0,
        ratingCount: 0,
        freelancerId: user.id,
        freelancer: user,
      };
      setDemoGigs([gig, ...getDemoGigs()]);
      return gig;
    },
  );

export const updateGig = (id, payload) =>
  withFallback(
    () => api.put(`/gigs/${id}`, payload),
    () => {
      const gigs = getDemoGigs().map((gig) => (gig._id === id ? { ...gig, ...payload } : gig));
      setDemoGigs(gigs);
      return gigs.find((gig) => gig._id === id);
    },
  );

export const deleteGig = (id) =>
  withFallback(
    () => api.delete(`/gigs/${id}`),
    () => {
      setDemoGigs(getDemoGigs().filter((gig) => gig._id !== id));
      return { ok: true };
    },
  );

export const createReview = (id, payload) =>
  withFallback(() => api.post(`/gigs/${id}/reviews`, payload), () => ({
    _id: `demo-review-${Date.now()}`,
    gigId: id,
    reviewer: payload.reviewer || 'Demo buyer',
    rating: Number(payload.rating || 5),
    comment: payload.comment || 'Great work.',
  }));

export const searchGigs = (params) => withFallback(() => api.get('/search', { params }), () => demoSearch(params));

export const aiSuggest = (payload) =>
  withFallback(() => api.post('/ai/suggest', payload), () => ({
    title: payload.title || 'Premium campus service package',
    description: 'A polished, buyer-friendly gig description with clear scope, timeline, and deliverables.',
    tags: ['student talent', 'fast delivery', 'professional'],
    price: Number(payload.budget || 25000),
    deliveryDays: 3,
  }));

export const signup = (payload) =>
  withFallback(
    () => api.post('/auth/signup', payload),
    () => {
      const user = setDemoUser({
        ...demoUser,
        ...payload,
        id: 'demo-user-local',
        role: payload.role || 'buyer',
        verificationStatus: payload.role === 'seller' ? 'pending' : 'verified',
        verifiedStudent: payload.role !== 'seller',
      });
      localStorage.setItem(TOKEN_KEY, 'demo-token');
      return { token: 'demo-token', user, needsVerification: payload.role === 'seller' };
    },
  );

export const login = (payload) =>
  withFallback(
    () => api.post('/auth/login', payload),
    () => {
      const user = setDemoUser({ ...getDemoUser(), email: payload.email || demoUser.email });
      localStorage.setItem(TOKEN_KEY, 'demo-token');
      return { token: 'demo-token', user };
    },
  );

export const verifyCampusEmail = () =>
  withFallback(
    () => api.post('/auth/verify-campus', {}),
    () => {
      const user = setDemoUser({ ...getDemoUser(), verificationStatus: 'verified', verifiedStudent: true });
      return { message: 'Campus account verified.', user };
    },
  );

export const resendCampusOtp = () =>
  withFallback(() => api.post('/auth/resend-campus', {}), () => ({ message: 'Demo OTP sent. Use 123456.' }));

export const fetchMe = () =>
  withFallback(
    () => api.get('/auth/me'),
    () => ({ user: localStorage.getItem(TOKEN_KEY) ? getDemoUser() : null }),
  );

export const createOrder = (payload) =>
  withFallback(
    () => api.post('/orders', payload),
    () => {
      const order = {
        _id: `demo-order-${Date.now()}`,
        ...payload,
        status: 'Placed',
        paymentStatus: 'Payment pending',
        createdAt: new Date().toISOString(),
      };
      setDemoOrders([order, ...getDemoOrders()]);
      return order;
    },
  );

export const fetchOrders = () => withFallback(() => api.get('/orders'), () => getDemoOrders());

export const startChat = (payload) =>
  withFallback(() => api.post('/chats/start', payload), () => ({ _id: `demo-chat-${Date.now()}`, ...payload }));

export const fetchChats = () => withFallback(() => api.get('/chats'), () => demoChats);

export const sendMessage = (id, payload) =>
  withFallback(() => api.post(`/chats/${id}/messages`, payload), () => ({ _id: id, ...payload }));

export const initEasypaisa = (payload) =>
  withFallback(() => api.post('/payments/easypaisa/init', payload), () => ({ ok: true, provider: 'easypaisa' }));

export const createStripeCheckout = (payload) =>
  withFallback(() => api.post('/stripe/checkout', payload), () => ({ url: null, message: 'Demo payment protected.' }));

export const fetchProfile = () => withFallback(() => api.get('/users/me'), () => getDemoUser());

export const updateProfile = (payload) =>
  withFallback(
    () => api.put('/users/me', payload),
    () => setDemoUser({ ...getDemoUser(), ...payload }),
  );

export const fetchSellerPublic = (id) =>
  withFallback(() => api.get(`/users/${id}/public`), () => ({
    seller: getDemoUser(),
    gigs: getDemoGigs().filter((gig) => gig.freelancerId === getDemoUser().id || gig.freelancer?.id === getDemoUser().id),
  }));

export const requestVerification = (payload) =>
  withFallback(
    () => api.post('/users/verify-request', payload),
    () => {
      const user = setDemoUser({
        ...getDemoUser(),
        verificationStatus: 'pending',
        verificationDocs: { ...payload, requestedAt: new Date().toISOString() },
      });
      return user;
    },
  );

export const fetchVerificationQueue = () =>
  withFallback(() => api.get('/admin/verification'), () => ({ items: [getDemoUser()], gigs: getDemoGigs() }));

export const approveVerification = (id, payload) =>
  withFallback(
    () => api.patch(`/admin/verification/${id}`, { status: 'verified', ...(payload || {}) }),
    () => setDemoUser({
      ...getDemoUser(),
      verificationStatus: 'verified',
      verifiedStudent: true,
      cnicVerified: true,
      verificationHistory: [
        ...(getDemoUser().verificationHistory || []),
        {
          status: 'verified',
          note: payload?.note || 'Approved by admin.',
          decidedAt: new Date().toISOString(),
          decidedBy: 'UniHire admin',
        },
      ],
    }),
  );

export const rejectVerification = (id, payload) =>
  withFallback(
    () => api.patch(`/admin/verification/${id}`, { status: 'rejected', ...(payload || {}) }),
    () => setDemoUser({
      ...getDemoUser(),
      verificationStatus: 'rejected',
      verifiedStudent: false,
      verificationHistory: [
        ...(getDemoUser().verificationHistory || []),
        {
          status: 'rejected',
          note: payload?.note || 'Rejected by admin.',
          decidedAt: new Date().toISOString(),
          decidedBy: 'UniHire admin',
        },
      ],
    }),
  );

export const approveGig = (id) =>
  withFallback(
    () => api.patch(`/admin/gigs/${id}`, { approvalStatus: 'approved' }),
    () => updateGig(id, { approvalStatus: 'approved', featured: true }),
  );

export const rejectGig = (id) =>
  withFallback(
    () => api.patch(`/admin/gigs/${id}`, { approvalStatus: 'rejected' }),
    () => updateGig(id, { approvalStatus: 'rejected', featured: false }),
  );

export const blockUser = (id) =>
  withFallback(
    () => api.patch(`/admin/users/${id}/block`, { blocked: true }),
    () => {
      const current = getDemoUser();
      const user = setDemoUser({ ...current, blocked: current.id === id ? true : current.blocked });
      setDemoGigs(getDemoGigs().map((gig) => ({
        ...gig,
        freelancer: gig.freelancer?.id === id ? { ...gig.freelancer, blocked: true } : gig.freelancer,
      })));
      return user;
    },
  );

export default api;
