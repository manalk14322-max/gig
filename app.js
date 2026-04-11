const STORAGE_KEYS = {
  lang: 'pakgigs.lang',
  savedIds: 'pakgigs.savedIds',
  customGigs: 'pakgigs.customGigs',
  projects: 'pakgigs.projects',
  orders: 'pakgigs.orders',
  threads: 'pakgigs.threads',
  wallet: 'pakgigs.wallet',
};

const cities = ['All Cities', 'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot'];
const categories = ['All Categories', 'Web Development', 'Graphic Design', 'Video Editing', 'SEO', 'Content Writing', 'Mobile App Design', 'Urdu Translation', 'Social Media'];
const payoutMethods = ['Easypaisa', 'JazzCash', 'Bank Transfer', 'Raast'];
const tabs = [
  { id: 'marketplace', label: { en: 'Marketplace', ur: 'مارکیٹ پلیس' } },
  { id: 'projects', label: { en: 'Projects', ur: 'پروجیکٹس' } },
  { id: 'inbox', label: { en: 'Inbox', ur: 'ان باکس' } },
  { id: 'wallet', label: { en: 'Wallet', ur: 'والیٹ' } },
  { id: 'studio', label: { en: 'Studio', ur: 'اسٹوڈیو' } },
];

const copy = {
  en: {
    brandTag: "Pakistan's freelance marketplace",
    heroEyebrow: 'Trusted freelance marketplace',
    heroTitle: 'Find your <span class="hero-highlight">perfect match</span>.',
    heroLead: 'Find the right talent and move your brief forward.',
    heroBrowse: 'Browse services',
    heroPostProject: 'Get started',
    categoriesEyebrow: 'Browse by category',
    categoriesTitle: 'Explore popular services.',
    spotlightEyebrow: 'Featured freelancers',
    spotlightTitle: 'Top Pakistani talent, ready to hire.',
    spotlightLead: 'Shortlist verified freelancers by skill, city, and budget without the clutter.',
    spotlightPoint1: 'Verified profiles with recent work',
    spotlightPoint2: 'Clear delivery times and PKR pricing',
    spotlightPoint3: 'Local payments and smooth communication',
    spotlightPrimary: 'Browse talent',
    spotlightSecondary: 'How it works',
    howEyebrow: 'How it works',
    howTitle: 'Post, compare, and hire in three simple steps.',
    howLead: 'A clear flow that keeps the platform fast, friendly, and easy to trust.',
    testimonialEyebrow: 'Testimonials',
    testimonialTitle: 'Trusted by buyers and freelancers across Pakistan.',
    statFreelancers: 'Verified freelancers',
    statCities: 'Cities covered',
    statPayouts: 'Local payment methods',
    search: 'Search services',
    searchPlaceholder: 'Logo design, WordPress, SEO...',
    city: 'City',
    category: 'Category',
    budget: 'Max budget',
    payments: 'Local payment options',
    quick: 'Quick actions',
    project: 'Post a brief',
    gig: 'Build a gig',
    order: 'Hire now',
    live: 'Live marketplace',
    panel: 'Filter by city, category, and budget to find the right freelancer faster.',
    searchCount: 'results',
    savedCount: 'bookmarks',
    allCities: 'All cities',
    allCategories: 'All categories',
    reset: 'Reset demo',
    save: 'Save',
    saved: 'Saved',
    activeOrders: 'Active orders',
    recentProjects: 'Recent briefs',
    noProjects: 'No briefs posted yet.',
    noOrders: 'No active orders yet.',
    noThreads: 'No conversations yet.',
    noMessages: 'No messages yet.',
    noGigs: 'No services published yet.',
    walletHint: 'Track available balance, pending funds, and payouts in one place.',
    withdraw: 'Request payout',
    withdrawHint: 'Choose a local payout method and queue the amount.',
    publishGig: 'Publish service',
    sellerProfile: 'Seller profile',
    yourGigs: 'Your services',
    projectFormTitle: 'Share a clear project brief',
    projectFormHint: 'Tell freelancers what you need and let the right matches come to you.',
    gigFormTitle: 'Create a service listing',
    gigFormHint: 'Write a clear offer that stands out in search.',
    threadHint: 'Open a chat and keep the project moving.',
    tabs: { marketplace: 'Marketplace', projects: 'Projects', inbox: 'Inbox', wallet: 'Wallet', studio: 'Studio' },
  },
  ur: {
    brandTag: 'پاکستان کی فری لانس مارکیٹ',
    heroEyebrow: 'قابلِ اعتماد فری لانس مارکیٹ پلیس',
    heroTitle: 'اپنا <span class="hero-highlight">بہترین</span> میچ تلاش کریں۔',
    heroLead: 'صحیح ٹیلنٹ تلاش کریں اور اپنا پروجیکٹ آگے بڑھائیں۔',
    heroBrowse: 'کیٹیگریز دیکھیں',
    heroPostProject: 'شروع کریں',
    categoriesEyebrow: 'کیٹیگری کے حساب سے دیکھیں',
    categoriesTitle: 'مقبول سروسز دیکھیں۔',
    spotlightEyebrow: 'منتخب ماہرین',
    spotlightTitle: 'منٹوں میں تصدیق شدہ ٹیلنٹ چنیں۔',
    spotlightLead: 'پاکستانی فری لانسرز کو مہارت، شہر، اور بجٹ کے حساب سے آسانی سے compare کریں۔',
    spotlightPoint1: 'تصدیق شدہ profiles اور حالیہ کام',
    spotlightPoint2: 'واضح delivery time اور PKR pricing',
    spotlightPoint3: 'لوکل payments اور آسان رابطہ',
    spotlightPrimary: 'ٹیلنٹ دیکھیں',
    spotlightSecondary: 'یہ کیسے کام کرتا ہے',
    statFreelancers: 'فری لانسرز',
    statCities: 'پاکستانی شہر',
    statPayouts: 'ادائیگی آپشنز',
    search: 'سروس تلاش کریں',
    searchPlaceholder: 'لوگو ڈیزائن، SEO، WordPress...',
    city: 'شہر',
    category: 'کیٹیگری',
    budget: 'زیادہ سے زیادہ بجٹ',
    payments: 'مقامی ادائیگی کے آپشنز',
    quick: 'فوری کارروائی',
    project: 'پروجیکٹ پوسٹ کریں',
    gig: 'Gig بنائیں',
    order: 'آرڈر کریں',
    live: 'لائیو مارکیٹ پلیس',
    panel: 'شہر، skill، اور budget کے حساب سے services تلاش کریں۔',
    searchCount: 'میچز ابھی',
    savedCount: 'محفوظ gigs',
    allCities: 'تمام شہر',
    allCategories: 'تمام کیٹیگریز',
    reset: 'Demo data reset کریں',
    save: 'محفوظ کریں',
    saved: 'محفوظ',
    activeOrders: 'ایکٹو آرڈرز',
    recentProjects: 'حالیہ briefs',
    noProjects: 'ابھی کوئی پروجیکٹ پوسٹ نہیں ہوا۔',
    noOrders: 'ابھی کوئی آرڈر نہیں ہے۔',
    noThreads: 'ابھی کوئی گفتگو نہیں ہے۔',
    noMessages: 'ابھی کوئی پیغام نہیں ہے۔',
    noGigs: 'ابھی کوئی gig شائع نہیں ہوا۔',
    walletHint: 'Available balance اور queued payouts فوراً update ہوتے ہیں۔',
    withdraw: 'withdrawal کی درخواست',
    withdrawHint: 'لوکل payout rail منتخب کریں اور amount queue کریں۔',
    publishGig: 'Gig شائع کریں',
    sellerProfile: 'سیلر پروفائل',
    yourGigs: 'آپ کے gigs',
    projectFormTitle: 'پروجیکٹ brief پوسٹ کریں',
    projectFormHint: 'صاف brief دیں اور پاکستانی freelancers سے bid لیں۔',
    gigFormTitle: 'نیا gig بنائیں',
    gigFormHint: 'اپنی سروس کو لوکل سرچ میں آسانی سے قابلِ تلاش بنائیں۔',
    threadHint: 'گفتگو منتخب کریں اور کام آگے بڑھائیں۔',
    tabs: { marketplace: 'مارکیٹ پلیس', projects: 'پروجیکٹس', inbox: 'ان باکس', wallet: 'والیٹ', studio: 'اسٹوڈیو' },
  },
};

const baseGigs = [
  { id: 'gig-1', title: 'WordPress store setup with Urdu support', seller: 'Amina Shah', city: 'Lahore', category: 'Web Development', price: 38000, delivery: 3, rating: 4.9, reviews: 112, verified: true, tags: ['WooCommerce', 'Cash on delivery', 'SEO ready'], description: 'Launch a clean online store with Urdu-ready pages, fast checkout, and mobile optimization.' },
  { id: 'gig-2', title: 'Short-form video edits for TikTok and Reels', seller: 'Bilal Ahmed', city: 'Karachi', category: 'Video Editing', price: 18000, delivery: 2, rating: 4.8, reviews: 86, verified: true, tags: ['Captions', 'Subtitles', 'Brand pack'], description: 'Punchy social clips with clean subtitles, motion text, and a simple brand style.' },
  { id: 'gig-3', title: 'Brand identity for startups and shops', seller: 'Hira Malik', city: 'Islamabad', category: 'Graphic Design', price: 25000, delivery: 3, rating: 4.9, reviews: 74, verified: true, tags: ['Logo', 'Style guide', 'Social kit'], description: 'A sharp identity system for new businesses that need polished visuals for launch.' },
  { id: 'gig-4', title: 'SEO audit in English and Urdu', seller: 'Zain Raza', city: 'Rawalpindi', category: 'SEO', price: 32000, delivery: 5, rating: 4.7, reviews: 53, verified: true, tags: ['Technical SEO', 'Keyword map', 'Local search'], description: 'Improve rankings with a practical audit for Pakistani service brands and stores.' },
  { id: 'gig-5', title: 'Mobile app UI in Figma', seller: 'Sana Javed', city: 'Faisalabad', category: 'Mobile App Design', price: 45000, delivery: 6, rating: 5, reviews: 39, verified: true, tags: ['Figma', 'Prototype', 'Design system'], description: 'Modern mobile screens with practical UX patterns and a polished handoff for developers.' },
  { id: 'gig-6', title: 'Urdu voice-over for ads and explainers', seller: 'Usman Qureshi', city: 'Peshawar', category: 'Content Writing', price: 14000, delivery: 1, rating: 4.8, reviews: 61, verified: false, tags: ['Voice over', 'Ads', 'Explainers'], description: 'Warm Urdu voice work for short promos, explainers, and social campaigns.' },
];

const baseProjects = [
  { id: 'project-1', title: 'Need an ecommerce store for ladies clothing', city: 'Karachi', budget: 'PKR 40,000 - 60,000', skills: ['WordPress', 'UI', 'Payments'], due: '3 days', bids: 18, status: 'Open', description: 'Launch a sleek store with product filters and local payment options.' },
  { id: 'project-2', title: 'Logo and social kit for a bakery', city: 'Lahore', budget: 'PKR 15,000 - 20,000', skills: ['Branding', 'Instagram', 'Packaging'], due: '2 days', bids: 11, status: 'Open', description: 'Need warm colors, a clean logo, and social templates that feel premium.' },
  { id: 'project-3', title: 'Bilingual landing page for SaaS launch', city: 'Islamabad', budget: 'PKR 30,000 - 50,000', skills: ['Figma', 'Frontend', 'Content'], due: '4 days', bids: 7, status: 'Reviewing', description: 'Need a fast landing page with Urdu and English copy and a strong CTA.' },
];

const baseOrders = [
  { id: 'order-1', title: 'WordPress store setup with Urdu support', buyer: 'Sana Textiles', freelancer: 'Amina Shah', budget: 'PKR 38,000', status: 'In progress', due: '3 days' },
  { id: 'order-2', title: 'Brand identity for startups and shops', buyer: 'Northstar Café', freelancer: 'Hira Malik', budget: 'PKR 25,000', status: 'Awaiting revision', due: '1 day' },
];

const baseThreads = [
  { id: 'thread-1', name: 'Sana Textiles', city: 'Karachi', role: 'Buyer', last: 'Can we add JazzCash checkout too?', time: '2m', messages: [{ from: 'buyer', text: 'Can we add JazzCash checkout too?' }, { from: 'you', text: 'Yes, I can wire that into the checkout flow.' }, { from: 'buyer', text: 'Perfect, please send the updated milestone.' }] },
  { id: 'thread-2', name: 'Northstar Café', city: 'Lahore', role: 'Buyer', last: 'The logo direction looks great. One more round of tweaks?', time: '18m', messages: [{ from: 'buyer', text: 'The logo direction looks great. One more round of tweaks?' }, { from: 'you', text: 'Absolutely, I will share a refined version today.' }] },
  { id: 'thread-3', name: 'PakBuilds', city: 'Islamabad', role: 'Agency', last: 'Can you handle the landing page copy in Urdu and English?', time: '1h', messages: [{ from: 'buyer', text: 'Can you handle the landing page copy in Urdu and English?' }, { from: 'you', text: 'Yes, I can draft both versions and keep the CTA consistent.' }] },
];

const defaultWallet = {
  available: 123000,
  pending: 61500,
  lifetime: 184500,
  payoutMethod: 'JazzCash',
  requests: [{ method: 'JazzCash', amount: 24000, status: 'Queued', time: 'Today' }, { method: 'Easypaisa', amount: 18000, status: 'Completed', time: 'Yesterday' }],
};

const state = {
  lang: localStorage.getItem(STORAGE_KEYS.lang) || 'en',
  profile: loadSellerProfile(),
  user: null,
  dashboard: null,
  authMode: 'login',
  authReady: false,
  authError: '',
  view: 'marketplace',
  search: '',
  city: 'All Cities',
  category: 'All Categories',
  maxBudget: 60000,
  selectedThreadId: null,
  savedIds: loadJSON(STORAGE_KEYS.savedIds, []),
  customGigs: loadJSON(STORAGE_KEYS.customGigs, []),
  projects: loadJSON(STORAGE_KEYS.projects, baseProjects),
  orders: loadJSON(STORAGE_KEYS.orders, baseOrders),
  threads: loadJSON(STORAGE_KEYS.threads, baseThreads),
  wallet: loadJSON(STORAGE_KEYS.wallet, defaultWallet),
};

const els = {
  brandTag: document.getElementById('brandTag'),
  langToggle: document.getElementById('langToggle'),
  navMarketplace: document.getElementById('navMarketplace'),
  navWhy: document.getElementById('navWhy'),
  navTrust: document.getElementById('navTrust'),
  navSignin: document.getElementById('navSignin'),
  navStart: document.getElementById('navStart'),
  heroEyebrow: document.getElementById('heroEyebrow'),
  heroTitle: document.getElementById('heroTitle'),
  heroLead: document.getElementById('heroLead'),
  heroBrowse: document.getElementById('heroBrowse'),
  heroPostProject: document.getElementById('heroPostProject'),
  heroSearchForm: document.getElementById('heroSearchForm'),
  heroSearchInput: document.getElementById('heroSearchInput'),
  heroSearchButton: document.getElementById('heroSearchButton'),
  heroPills: document.getElementById('heroPills'),
  categoriesEyebrow: document.getElementById('categoriesEyebrow'),
  categoriesTitle: document.getElementById('categoriesTitle'),
  howEyebrow: document.getElementById('howEyebrow'),
  howTitle: document.getElementById('howTitle'),
  howLead: document.getElementById('howLead'),
  spotlightEyebrow: document.getElementById('spotlightEyebrow'),
  spotlightTitle: document.getElementById('spotlightTitle'),
  spotlightLead: document.getElementById('spotlightLead'),
  spotlightPoint1: document.getElementById('spotlightPoint1'),
  spotlightPoint2: document.getElementById('spotlightPoint2'),
  spotlightPoint3: document.getElementById('spotlightPoint3'),
  spotlightPrimary: document.getElementById('spotlightPrimary'),
  spotlightSecondary: document.getElementById('spotlightSecondary'),
  testimonialEyebrow: document.getElementById('testimonialEyebrow'),
  testimonialTitle: document.getElementById('testimonialTitle'),
  categoryRail: document.getElementById('categoryRail'),
  statFreelancersLabel: document.getElementById('statFreelancersLabel'),
  statCitiesLabel: document.getElementById('statCitiesLabel'),
  statPayoutsLabel: document.getElementById('statPayoutsLabel'),
  searchLabel: document.getElementById('searchLabel'),
  searchInput: document.getElementById('searchInput'),
  cityLabel: document.getElementById('cityLabel'),
  citySelect: document.getElementById('citySelect'),
  categoryLabel: document.getElementById('categoryLabel'),
  categorySelect: document.getElementById('categorySelect'),
  budgetLabel: document.getElementById('budgetLabel'),
  budgetValue: document.getElementById('budgetValue'),
  budgetRange: document.getElementById('budgetRange'),
  paymentLabel: document.getElementById('paymentLabel'),
  paymentPills: document.getElementById('paymentPills'),
  resultCountLabel: document.getElementById('resultCountLabel'),
  savedCountLabel: document.getElementById('savedCountLabel'),
  resultCount: document.getElementById('resultCount'),
  savedCount: document.getElementById('savedCount'),
  quickPostLabel: document.getElementById('quickPostLabel'),
  quickHireBtn: document.getElementById('quickHireBtn'),
  quickGigBtn: document.getElementById('quickGigBtn'),
  panelEyebrow: document.getElementById('panelEyebrow'),
  panelTitle: document.getElementById('panelTitle'),
  panelLead: document.getElementById('panelLead'),
  viewTabs: document.getElementById('viewTabs'),
  viewPanel: document.getElementById('viewPanel'),
  toast: document.getElementById('toast'),
  resetDemo: document.getElementById('resetDemo'),
  miniEyebrow: document.getElementById('miniEyebrow'),
  miniTitle: document.getElementById('miniTitle'),
};

const money = new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 });

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : clone(fallback);
  } catch {
    return clone(fallback);
  }
}

function defaultSellerProfile() {
  return {
    displayName: 'Manal Khan',
    username: 'manal-khan',
    email: 'manal@example.com',
    city: 'Lahore',
    headline: 'Creative freelancer and WordPress expert',
    bio: 'I help brands build polished digital experiences.',
    skills: ['WordPress', 'SEO', 'Figma'],
    role: 'seller',
  };
}

function loadSellerProfile() {
  const demoNames = new Set([
    ['Hassan', 'Ali'].join(' '),
    ['Your', 'Fiverr', 'Name'].join(' '),
    ['Your', 'name'].join(' '),
  ]);
  const keys = [STORAGE_KEYS.sellerProfile, STORAGE_KEYS.onboardingDraft, STORAGE_KEYS.googleUser];

  for (const key of keys) {
    const profile = loadJSON(key, null);
    const name = String(profile?.displayName || profile?.name || '').trim();
    if (profile && name && !demoNames.has(name)) {
      return profile;
    }
  }

  return defaultSellerProfile();
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function t(key) {
  const dictionary = copy[state.lang] || copy.en;
  return dictionary[key] || copy.en[key] || key;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function activeGigs() {
  return [...state.customGigs, ...baseGigs];
}

function savedSet() {
  return new Set(state.savedIds);
}

function filteredGigs() {
  const query = state.search.trim().toLowerCase();
  return activeGigs().filter((gig) => {
    const text = [gig.title, gig.seller, gig.city, gig.category, gig.description, ...(gig.tags || [])].join(' ').toLowerCase();
    return (!query || text.includes(query)) &&
      (state.city === 'All Cities' || gig.city === state.city) &&
      (state.category === 'All Categories' || gig.category === state.category) &&
      gig.price <= state.maxBudget;
  });
}

function currentThread() {
  return state.threads.find((thread) => thread.id === state.selectedThreadId) || state.threads[0];
}

function displayRole(role) {
  return role === 'seller' ? (state.lang === 'ur' ? 'سیلر' : 'Seller') : state.lang === 'ur' ? 'بائر' : 'Buyer';
}

function buildLocalDashboard() {
  const seller = state.user?.role === 'seller';
  if (seller) {
    return {
      summary: state.lang === 'ur'
        ? 'آپ کے سیلر ورک اسپیس کا خلاصہ یہاں ہے۔'
        : 'Your seller workspace is ready at a glance.',
      metrics: [
        { label: state.lang === 'ur' ? 'Active orders' : 'Active orders', value: String(state.orders.length), note: state.lang === 'ur' ? 'Work in progress' : 'Work in progress' },
        { label: state.lang === 'ur' ? 'Services' : 'Services', value: String(Math.max(state.customGigs.length, 1)), note: state.lang === 'ur' ? 'Listings live' : 'Listings live' },
        { label: state.lang === 'ur' ? 'Pending payouts' : 'Pending payouts', value: money.format(state.wallet.pending), note: state.lang === 'ur' ? 'Queued to wallet' : 'Queued to wallet' },
        { label: state.lang === 'ur' ? 'Profile score' : 'Profile score', value: '92%', note: state.lang === 'ur' ? 'Close to complete' : 'Close to complete' },
      ],
      activity: [
        { title: state.lang === 'ur' ? 'نیا آرڈر ملا' : 'New order received', detail: state.orders[0]?.title || (state.lang === 'ur' ? 'کوئی آرڈر نہیں' : 'No orders yet'), time: '2h' },
        { title: state.lang === 'ur' ? 'پے آؤٹ تیار ہے' : 'Payout queued', detail: money.format(state.wallet.pending || 0), time: 'Today' },
        { title: state.lang === 'ur' ? 'پروفائل مکمل کریں' : 'Complete your profile', detail: state.lang === 'ur' ? 'فائیو اسٹار رپوٹیشن کے لیے' : 'For stronger conversion', time: 'Now' },
      ],
      nextSteps: [
        state.lang === 'ur' ? 'نئی سروس شائع کریں' : 'Publish a new service',
        state.lang === 'ur' ? 'ابن باکس کھولیں' : 'Open your inbox',
        state.lang === 'ur' ? 'والیٹ چیک کریں' : 'Check wallet activity',
      ],
    };
  }

  return {
    summary: state.lang === 'ur'
      ? 'آپ کے بائر ورک اسپیس کا خلاصہ یہاں ہے۔'
      : 'Your buyer workspace is ready at a glance.',
    metrics: [
      { label: state.lang === 'ur' ? 'Open briefs' : 'Open briefs', value: String(state.projects.length), note: state.lang === 'ur' ? 'Requests in play' : 'Requests in play' },
      { label: state.lang === 'ur' ? 'Saved services' : 'Saved services', value: String(state.savedIds.length), note: state.lang === 'ur' ? 'Bookmarked for later' : 'Bookmarked for later' },
      { label: state.lang === 'ur' ? 'Budget active' : 'Budget active', value: money.format(state.wallet.available + state.wallet.pending), note: state.lang === 'ur' ? 'Workspace spend' : 'Workspace spend' },
      { label: state.lang === 'ur' ? 'Messages' : 'Messages', value: String(state.threads.length), note: state.lang === 'ur' ? 'Live conversations' : 'Live conversations' },
    ],
    activity: [
      { title: state.lang === 'ur' ? 'نیا brief پوسٹ ہوا' : 'A brief was posted', detail: state.projects[0]?.title || (state.lang === 'ur' ? 'ابھی کوئی brief نہیں' : 'No briefs yet'), time: '2h' },
      { title: state.lang === 'ur' ? 'نئی گفتگو' : 'New conversation', detail: state.threads[0]?.name || (state.lang === 'ur' ? 'ابھی کوئی بات چیت نہیں' : 'No conversations yet'), time: '14m' },
      { title: state.lang === 'ur' ? 'ٹاپ میچ محفوظ' : 'Top match saved', detail: state.savedIds.length ? String(state.savedIds.length) : (state.lang === 'ur' ? 'کوئی محفوظ نہیں' : 'Nothing saved yet'), time: 'Today' },
    ],
    nextSteps: [
      state.lang === 'ur' ? 'نیا brief پوسٹ کریں' : 'Post a new brief',
      state.lang === 'ur' ? 'Saved services دیکھیں' : 'Review saved services',
      state.lang === 'ur' ? 'messages چیک کریں' : 'Check messages',
    ],
  };
}

function requireAuth(mode = 'login', message = 'Please sign in to continue.') {
  return true;
}

function apiRequest(path, options = {}) {
  return fetch(path, {
    credentials: 'same-origin',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
    ...options,
  }).then(async (response) => {
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : await response.text();
    if (!response.ok) {
      const error = new Error(data?.error || data?.message || 'Request failed');
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  });
}

async function loadSession() {
  try {
    const data = await apiRequest('/api/auth/me');
    state.user = data.user || null;
    state.authReady = true;
    if (state.user) {
      await loadDashboard();
      state.view = 'dashboard';
    } else {
      state.dashboard = null;
      if (state.view === 'dashboard') {
        state.view = 'marketplace';
      }
    }
  } catch {
    state.user = null;
    state.dashboard = null;
    state.authReady = true;
    if (state.view === 'dashboard') {
      state.view = 'marketplace';
    }
  }
  render();
}

async function loadDashboard() {
  if (!state.user) return;
  try {
    const data = await apiRequest('/api/dashboard');
    state.dashboard = data;
  } catch {
    state.dashboard = buildLocalDashboard();
  }
}

async function submitAuth(form) {
  const data = new FormData(form);
  const payload = {};
  data.forEach((value, key) => {
    payload[key] = String(value || '').trim();
  });

  const mode = state.authMode === 'signup' ? 'signup' : 'login';
  const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
  try {
    state.authError = '';
    const response = await apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    state.user = response.user;
    await loadDashboard();
    state.view = 'dashboard';
    state.authMode = 'login';
    render();
    form.reset();
    showToast(mode === 'signup' ? (state.lang === 'ur' ? 'اکاؤنٹ بن گیا' : 'Account created') : (state.lang === 'ur' ? 'لاگ ان ہوگئے' : 'Signed in'));
  } catch (error) {
    state.authError = error.message || 'Unable to sign in';
    render();
    showToast(error.message || 'Unable to sign in');
  }
}

async function logout() {
  try {
    await apiRequest('/api/auth/logout', { method: 'POST' });
  } catch {
    // ignore logout errors and fall through to local reset
  }
  state.user = null;
  state.dashboard = null;
  state.view = 'marketplace';
  state.authMode = 'login';
  state.authError = '';
  render();
  showToast(state.lang === 'ur' ? 'لاگ آؤٹ ہوگئے' : 'Signed out');
  document.getElementById('top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setView(view) {
  if (view === 'dashboard' && !state.user) {
    promptAuth('login', state.lang === 'ur' ? 'ڈیش بورڈ دیکھنے کے لیے لاگ ان کریں۔' : 'Sign in to view your dashboard.');
    return;
  }
  state.view = view;
  render();
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('is-visible');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove('is-visible'), 2200);
}

function renderFilterOptions() {
  els.citySelect.innerHTML = cities
    .map((city) => `<option value="${escapeHtml(city)}">${escapeHtml(city === 'All Cities' ? t('allCities') : city)}</option>`)
    .join('');
  els.categorySelect.innerHTML = categories
    .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category === 'All Categories' ? t('allCategories') : category)}</option>`)
    .join('');
  els.citySelect.value = state.city;
  els.categorySelect.value = state.category;
  els.budgetRange.value = String(state.maxBudget);
  els.budgetValue.textContent = money.format(state.maxBudget);
  els.searchInput.value = state.search;
  if (els.heroSearchInput) {
    els.heroSearchInput.value = state.search;
  }
}

function renderPaymentPills() {
  els.paymentPills.innerHTML = payoutMethods.map((method) => `<span class="chip">${escapeHtml(method)}</span>`).join('');
}

function renderTabs() {
  els.viewTabs.innerHTML = tabs
    .map(
      (tab) => `
        <button class="${state.view === tab.id ? 'is-active' : ''}" type="button" data-view="${escapeHtml(tab.id)}" role="tab" aria-selected="${
          state.view === tab.id ? 'true' : 'false'
        }">${escapeHtml(tab.label[state.lang] || tab.label.en)}</button>
      `,
    )
    .join('');
}

function syncStaticCopy() {
  els.brandTag.textContent = t('brandTag');
  els.navMarketplace.textContent = state.lang === 'ur' ? 'دیکھیں' : 'Explore';
  if (els.navWhy) {
    els.navWhy.textContent = state.lang === 'ur' ? 'یہ کیسے کام کرتا ہے' : 'How it works';
    els.navWhy.href = 'how.html';
  }
  els.navTrust.textContent = state.lang === 'ur' ? 'سیلر بنیں' : 'Become a Seller';
  if (els.navTrust) {
    els.navTrust.href = 'seller.html';
  }
  if (els.navSignin) {
    els.navSignin.textContent = state.lang === 'ur' ? 'سائن ان' : 'Sign in';
    els.navSignin.href = '#categories';
  }
  els.navStart.textContent = state.lang === 'ur' ? 'جوائن' : 'Join now';
  els.navStart.setAttribute('aria-label', state.lang === 'ur' ? 'جوائن' : 'Join now');
  els.heroEyebrow.textContent = t('heroEyebrow');
  els.heroTitle.innerHTML = t('heroTitle');
  els.heroLead.textContent = t('heroLead');
  els.heroBrowse.textContent = t('heroBrowse');
  els.heroPostProject.textContent = t('heroPostProject');
  if (els.categoriesEyebrow) {
    els.categoriesEyebrow.textContent = t('categoriesEyebrow');
  }
  if (els.categoriesTitle) {
    els.categoriesTitle.textContent = t('categoriesTitle');
  }
  if (els.howEyebrow) {
    els.howEyebrow.textContent = t('howEyebrow');
  }
  if (els.howTitle) {
    els.howTitle.textContent = t('howTitle');
  }
  if (els.howLead) {
    els.howLead.textContent = t('howLead');
  }
  if (els.spotlightEyebrow) {
    els.spotlightEyebrow.textContent = t('spotlightEyebrow');
  }
  if (els.spotlightTitle) {
    els.spotlightTitle.textContent = t('spotlightTitle');
  }
  if (els.spotlightLead) {
    els.spotlightLead.textContent = t('spotlightLead');
  }
  if (els.spotlightPoint1) {
    els.spotlightPoint1.textContent = t('spotlightPoint1');
  }
  if (els.spotlightPoint2) {
    els.spotlightPoint2.textContent = t('spotlightPoint2');
  }
  if (els.spotlightPoint3) {
    els.spotlightPoint3.textContent = t('spotlightPoint3');
  }
  if (els.spotlightPrimary) {
    els.spotlightPrimary.textContent = t('spotlightPrimary');
  }
  if (els.spotlightSecondary) {
    els.spotlightSecondary.textContent = t('spotlightSecondary');
  }
  if (els.testimonialEyebrow) {
    els.testimonialEyebrow.textContent = t('testimonialEyebrow');
  }
  if (els.testimonialTitle) {
    els.testimonialTitle.textContent = t('testimonialTitle');
  }
  els.statFreelancersLabel.textContent = t('statFreelancers');
  els.statCitiesLabel.textContent = t('statCities');
  els.statPayoutsLabel.textContent = t('statPayouts');
  els.searchLabel.textContent = t('search');
  els.searchInput.placeholder = t('searchPlaceholder');
  if (els.heroSearchInput) {
    els.heroSearchInput.placeholder =
      state.lang === 'ur' ? 'کسی بھی سروس کو تلاش کریں...' : 'Search for any service...';
  }
  if (els.heroSearchButton) {
    els.heroSearchButton.textContent = '\u2315';
    els.heroSearchButton.setAttribute('aria-label', state.lang === 'ur' ? 'تلاش' : 'Search');
  }
  els.cityLabel.textContent = t('city');
  els.categoryLabel.textContent = t('category');
  els.budgetLabel.textContent = t('budget');
  els.paymentLabel.textContent = t('payments');
  els.resultCountLabel.textContent = t('searchCount');
  els.savedCountLabel.textContent = t('savedCount');
  els.quickPostLabel.textContent = t('quick');
  els.quickHireBtn.textContent = t('project');
  els.quickGigBtn.textContent = t('gig');
  els.panelEyebrow.textContent = t('live');
  els.panelLead.textContent = t('panel');
  els.resetDemo.textContent = t('reset');
  els.miniEyebrow.textContent = state.lang === 'ur' ? 'اپ کے قریب بہترین میچ' : 'Best local match';
  els.miniTitle.textContent = state.lang === 'ur' ? 'WordPress اسٹور سیٹ اپ' : 'WordPress store setup';
  els.langToggle.textContent = state.lang === 'ur' ? 'English' : 'اردو';
  if (els.navSignin) {
    els.navSignin.textContent = state.lang === 'ur' ? 'ٹیلنٹ دیکھیں' : 'Browse talent';
    els.navSignin.href = '#categories';
  }
  els.navStart.textContent = state.lang === 'ur' ? 'شروع کریں' : 'Get started';
  els.navStart.setAttribute('aria-label', state.lang === 'ur' ? 'شروع کریں' : 'Get started');
  renderFilterOptions();
  renderPaymentPills();
}

function renderAccountHub() {
  if (!state.authReady) {
    return `
      <div class="auth-loading">
        <p class="eyebrow">${escapeHtml(state.lang === 'ur' ? 'اکاؤنٹ' : 'Account')}</p>
        <h2>${escapeHtml(state.lang === 'ur' ? 'آپ کا ورک اسپیس لوڈ ہو رہا ہے…' : 'Loading your workspace…')}</h2>
        <p class="auth-note">${escapeHtml(state.lang === 'ur' ? 'براہ کرم تھوڑا انتظار کریں۔' : 'Please wait a moment.')}</p>
      </div>
    `;
  }

  if (state.user) {
    const dashboard = state.dashboard || buildLocalDashboard();
    const metricCards = dashboard.metrics
      .map(
        (metric) => `
          <article class="metric-card">
            <p class="wallet-sub">${escapeHtml(metric.label)}</p>
            <strong>${escapeHtml(metric.value)}</strong>
            <span>${escapeHtml(metric.note)}</span>
          </article>
        `,
      )
      .join('');

    return `
      <div class="dashboard-shell">
        <div class="dashboard-head">
          <div>
            <p class="eyebrow">${escapeHtml(state.lang === 'ur' ? 'ڈیش بورڈ' : 'Dashboard')}</p>
            <h2>${escapeHtml(state.lang === 'ur' ? `خوش آمدید، ${state.user.name}` : `Welcome back, ${state.user.name}`)}</h2>
            <p>${escapeHtml(dashboard.summary)}</p>
          </div>
          <div class="dashboard-actions">
            <span class="status-badge">${escapeHtml(displayRole(state.user.role))}</span>
            <button class="btn btn--ghost" type="button" data-action="logout">${escapeHtml(state.lang === 'ur' ? 'سائن آؤٹ' : 'Sign out')}</button>
          </div>
        </div>
        <div class="metric-grid">${metricCards}</div>
      </div>
    `;
  }

  const signingUp = state.authMode === 'signup';
  return `
    <div class="auth-layout">
      <div class="auth-copy">
        <p class="eyebrow">${escapeHtml(state.lang === 'ur' ? 'اکاؤنٹ' : 'Account access')}</p>
        <h2>${escapeHtml(
          signingUp
            ? state.lang === 'ur'
              ? 'نیا اکاؤنٹ بنائیں'
              : 'Create your workspace account'
            : state.lang === 'ur'
              ? 'اپنے اکاؤنٹ میں سائن ان کریں'
              : 'Sign in to your workspace',
        )}</h2>
        <p>${escapeHtml(
          signingUp
            ? state.lang === 'ur'
              ? 'ایک اکاؤنٹ سے briefs، inbox، wallet، اور studio سب manage کریں۔'
              : 'Create one account to manage briefs, messages, and payouts.'
            : state.lang === 'ur'
              ? 'ڈیش بورڈ، inbox، wallet، اور studio ایک ہی جگہ سے کھولیں۔'
              : 'Use one secure login to open dashboard, inbox, wallet, and studio.',
        )}</p>
        <div class="auth-benefits">
          <div>
            <strong>${escapeHtml(state.lang === 'ur' ? 'ایک اکاؤنٹ' : 'One account')}</strong>
            <span>${escapeHtml(state.lang === 'ur' ? 'خریداری اور فروخت ایک ہی جگہ' : 'Buy and sell from the same workspace')}</span>
          </div>
          <div>
            <strong>${escapeHtml(state.lang === 'ur' ? 'محفوظ session' : 'Secure session')}</strong>
            <span>${escapeHtml(state.lang === 'ur' ? 'یہ browser پر برقرار رہتا ہے' : 'It stays on this browser')}</span>
          </div>
          <div>
            <strong>${escapeHtml(state.lang === 'ur' ? 'Local payments' : 'Local payments')}</strong>
            <span>${escapeHtml(state.lang === 'ur' ? 'JazzCash، Easypaisa، Raast' : 'JazzCash, Easypaisa, Raast')}</span>
          </div>
        </div>
      </div>
      <div class="auth-panel">
        <div class="segmented auth-tabs" role="tablist" aria-label="${escapeHtml(state.lang === 'ur' ? 'اکاؤنٹ tabs' : 'Account tabs')}">
          <button class="${signingUp ? '' : 'is-active'}" type="button" data-auth-mode="login" role="tab" aria-selected="${signingUp ? 'false' : 'true'}">${escapeHtml(
            state.lang === 'ur' ? 'سائن ان' : 'Sign in',
          )}</button>
          <button class="${signingUp ? 'is-active' : ''}" type="button" data-auth-mode="signup" role="tab" aria-selected="${signingUp ? 'true' : 'false'}">${escapeHtml(
            state.lang === 'ur' ? 'اکاؤنٹ بنائیں' : 'Create account',
          )}</button>
        </div>
        ${state.authError ? `<p class="auth-error">${escapeHtml(state.authError)}</p>` : ''}
        <form id="authForm" class="auth-form">
          ${
            signingUp
              ? `
                <label>
                  <span class="field-label">${escapeHtml(state.lang === 'ur' ? 'نام' : 'Full name')}</span>
                  <input name="name" type="text" placeholder="${escapeHtml(state.lang === 'ur' ? 'مثلاً Amina Khan' : 'Amina Khan')}" required />
                </label>
                <label>
                  <span class="field-label">${escapeHtml(state.lang === 'ur' ? 'اکاؤنٹ ٹائپ' : 'Account type')}</span>
                  <select name="role">
                    <option value="buyer">${escapeHtml(state.lang === 'ur' ? 'خریدنے والا' : 'Buyer')}</option>
                    <option value="seller">${escapeHtml(state.lang === 'ur' ? 'فروخت کرنے والا' : 'Seller')}</option>
                  </select>
                </label>
              `
              : ''
          }
          <label>
            <span class="field-label">${escapeHtml(state.lang === 'ur' ? 'ای میل' : 'Email')}</span>
            <input name="email" type="email" placeholder="name@company.com" required />
          </label>
          <label>
            <span class="field-label">${escapeHtml(state.lang === 'ur' ? 'پاس ورڈ' : 'Password')}</span>
            <input name="password" type="password" minlength="8" placeholder="${escapeHtml(state.lang === 'ur' ? 'کم از کم 8 حروف' : 'At least 8 characters')}" required />
          </label>
          <div class="form-actions">
            <button class="btn btn--primary" type="submit">${escapeHtml(
              signingUp
                ? state.lang === 'ur'
                  ? 'اکاؤنٹ بنائیں'
                  : 'Create account'
                : state.lang === 'ur'
                  ? 'سائن ان کریں'
                  : 'Sign in',
            )}</button>
          </div>
        </form>
        <p class="auth-note">${escapeHtml(
          signingUp
            ? state.lang === 'ur'
              ? 'اکاؤنٹ بنانے کے بعد dashboard فوراً کھل جائے گا۔'
              : 'After signup, your dashboard opens immediately.'
            : state.lang === 'ur'
              ? 'یہ session آپ کے browser پر محفوظ رہے گی۔'
              : 'Your session stays active on this browser.',
        )}</p>
        <button class="btn btn--ghost full" type="button" data-auth-mode="${signingUp ? 'login' : 'signup'}">${escapeHtml(
          signingUp
            ? state.lang === 'ur'
              ? 'پہلے سے اکاؤنٹ ہے؟ سائن ان کریں'
              : 'Already have an account? Sign in'
            : state.lang === 'ur'
              ? 'نیا اکاؤنٹ بنائیں'
              : 'Need an account? Create one',
        )}</button>
      </div>
    </div>
  `;
}

function renderDashboardView() {
  const dashboard = state.dashboard || buildLocalDashboard();
  const stepViews = state.user?.role === 'seller' ? ['studio', 'inbox', 'wallet'] : ['projects', 'inbox', 'wallet'];
  const metrics = dashboard.metrics
    .map(
      (metric) => `
        <article class="metric-card">
          <p class="wallet-sub">${escapeHtml(metric.label)}</p>
          <strong>${escapeHtml(metric.value)}</strong>
          <span>${escapeHtml(metric.note)}</span>
        </article>
      `,
    )
    .join('');
  const activity = dashboard.activity
    .map(
      (item) => `
        <article class="dashboard-item">
          <div class="section-head">
            <strong>${escapeHtml(item.title)}</strong>
            <span class="thread-time">${escapeHtml(item.time)}</span>
          </div>
          <p class="project-desc">${escapeHtml(item.detail)}</p>
        </article>
      `,
    )
    .join('');
  const nextSteps = dashboard.nextSteps
    .map(
      (step, index) => `
        <button class="dashboard-item dashboard-item--button" type="button" data-view="${stepViews[index] || 'marketplace'}">
          <span class="step-index">${index + 1}</span>
          <span>${escapeHtml(step)}</span>
        </button>
      `,
    )
    .join('');

  return `
    <div class="view-intro">
      <div>
        <p class="eyebrow">${escapeHtml(state.lang === 'ur' ? 'ورک اسپیس' : 'Workspace')}</p>
        <h3>${escapeHtml(dashboard.summary)}</h3>
      </div>
      <div class="summary-pill">${escapeHtml(displayRole(state.user?.role || 'buyer'))}</div>
    </div>
    <div class="dashboard-grid">
      <section class="section-block">
        <div class="section-head">
          <h3>${escapeHtml(state.lang === 'ur' ? 'Next steps' : 'Next steps')}</h3>
          <span class="summary-pill">${dashboard.nextSteps.length} ${state.lang === 'ur' ? 'اقدامات' : 'steps'}</span>
        </div>
        <div class="dashboard-list">${nextSteps}</div>
      </section>
      <section class="section-block">
        <div class="section-head">
          <h3>${escapeHtml(state.lang === 'ur' ? 'Key metrics' : 'Key metrics')}</h3>
          <span class="summary-pill">${dashboard.metrics.length} ${state.lang === 'ur' ? 'میٹرکس' : 'metrics'}</span>
        </div>
        <div class="metric-grid metric-grid--compact">${metrics}</div>
      </section>
      <section class="section-block" style="grid-column:1/-1;">
        <div class="section-head">
          <h3>${escapeHtml(state.lang === 'ur' ? 'Recent activity' : 'Recent activity')}</h3>
          <span class="summary-pill">${dashboard.activity.length} ${state.lang === 'ur' ? 'اپ ڈیٹس' : 'updates'}</span>
        </div>
        <div class="dashboard-list">${activity}</div>
      </section>
    </div>
  `;
}

function renderMarketplace() {
  const gigs = filteredGigs();
  const saved = savedSet();
  const countWord = state.lang === 'ur' ? (gigs.length === 1 ? 'نتیجہ' : 'نتائج') : gigs.length === 1 ? 'result' : 'results';

  return `
    <div class="view-intro">
      <div>
        <p class="eyebrow">${escapeHtml(state.lang === 'ur' ? 'منتخب services' : 'Popular services')}</p>
        <h3>${escapeHtml(state.lang === 'ur' ? 'آسانی سے لوکل ٹیلنٹ ڈھونڈیں۔' : 'Browse the services you need in minutes.')}</h3>
      </div>
      <div class="summary-pill">${gigs.length} ${countWord}</div>
    </div>
    <div class="gig-grid">
      ${
        gigs.length
          ? gigs
              .map((gig) => {
                const isSaved = saved.has(gig.id);
                return `
                  <article class="gig-card">
                    <div class="gig-card__top">
                      <div class="avatar">${escapeHtml(initials(gig.seller))}</div>
                      <div>
                        <p class="gig-category">${escapeHtml(gig.category)}</p>
                        <h4>${escapeHtml(gig.title)}</h4>
                        <p class="gig-seller">${escapeHtml(gig.seller)} · ${escapeHtml(gig.city)}</p>
                      </div>
                      <button class="icon-btn" type="button" data-action="save" data-id="${escapeHtml(gig.id)}" aria-pressed="${
                  isSaved ? 'true' : 'false'
                }">${isSaved ? t('saved') : t('save')}</button>
                    </div>
                    <p class="gig-desc">${escapeHtml(gig.description)}</p>
                    <div class="gig-tags">${(gig.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>
                    <div class="gig-meta">
                      <span><strong class="gig-rating">${gig.rating.toFixed(1)}</strong> rating</span>
                      <span>${gig.delivery} days</span>
                      <span>${gig.reviews} reviews</span>
                      <span>${gig.verified ? 'Verified' : 'New'}</span>
                    </div>
                    <div class="gig-footer">
                      <div>
                        <small class="wallet-sub">${state.lang === 'ur' ? 'شروع سے' : 'Starting at'}</small>
                        <span class="price">${money.format(gig.price)}</span>
                      </div>
                      <button class="btn btn--secondary" type="button" data-action="order" data-id="${escapeHtml(gig.id)}">${escapeHtml(
                  t('order'),
                )}</button>
                    </div>
                  </article>
                `;
              })
              .join('')
          : `<div class="section-block" style="grid-column:1/-1;"><p class="eyebrow">${escapeHtml(
              state.lang === 'ur' ? 'منتخب services' : 'Popular services',
            )}</p><h3>${escapeHtml(state.lang === 'ur' ? 'ان filters کے مطابق ابھی gigs نہیں ہیں۔' : 'No services match those filters yet.')}</h3></div>`
      }
    </div>
  `;
}

function renderProjects() {
  const projects = [...state.projects].sort((a, b) => b.bids - a.bids);
  const orders = [...state.orders];
  return `
    <div class="view-intro">
      <div>
        <p class="eyebrow">${escapeHtml(state.lang === 'ur' ? 'خریدار کی درخواستیں' : 'Project briefs')}</p>
        <h3>${escapeHtml(state.lang === 'ur' ? 'کھلے کام، پوسٹ کیے گئے briefs، اور اگلا موقع ٹریک کریں۔' : 'Track live briefs, active orders, and the next opportunity.')}</h3>
      </div>
      <div class="summary-pill">${projects.length} ${state.lang === 'ur' ? 'بریفز' : 'briefs'}</div>
    </div>
    <div class="sections-grid">
      <section class="section-block">
        <div class="section-head">
          <h3>${escapeHtml(t('activeOrders'))}</h3>
          <span class="summary-pill">${orders.length} ${state.lang === 'ur' ? 'آرڈرز' : 'orders'}</span>
        </div>
        <div class="order-list">
          ${orders.length ? orders.map((order) => `<article class="order-card"><div class="section-head"><div><strong>${escapeHtml(order.title)}</strong><p class="project-desc">${escapeHtml(order.buyer)} · ${escapeHtml(order.freelancer)}</p></div><span class="status-badge">${escapeHtml(order.status)}</span></div><div class="project-meta"><span>${escapeHtml(order.budget)}</span><span>${escapeHtml(order.due)}</span></div></article>`).join('') : `<p class="section-note">${escapeHtml(t('noOrders') || 'No live jobs yet.')}</p>`}
        </div>
      </section>
      <section class="section-block">
        <div class="section-head">
          <h3>${escapeHtml(t('recentProjects'))}</h3>
          <span class="summary-pill">${projects.length} ${state.lang === 'ur' ? 'بریفز' : 'briefs'}</span>
        </div>
        <div class="project-list">
          ${projects.length ? projects.map((project) => `<article class="project-card"><div class="section-head"><div><strong>${escapeHtml(project.title)}</strong><p class="project-desc">${escapeHtml(project.description)}</p></div><span class="status-badge ${project.status === 'Reviewing' ? 'status-badge--warning' : 'status-badge--muted'}">${escapeHtml(project.status)}</span></div><div class="project-meta"><span>${escapeHtml(project.city)}</span><span>${escapeHtml(project.budget)}</span><span>${project.bids} bids</span><span>${escapeHtml(project.due)}</span></div><div class="chip-stack">${(project.skills || []).map((skill) => `<span class="chip">${escapeHtml(skill)}</span>`).join('')}</div></article>`).join('') : `<p class="section-note">${escapeHtml(t('noProjects') || 'No briefs yet.')}</p>`}
        </div>
      </section>
      <section class="section-block" style="grid-column:1/-1;">
        <p class="eyebrow">${escapeHtml(t('projectFormTitle'))}</p>
        <h3>${escapeHtml(t('projectFormHint'))}</h3>
        <p class="project-desc">${escapeHtml(state.lang === 'ur' ? 'صاف brief دیں اور پاکستانی freelancers سے bid لیں۔' : 'Tell freelancers what you need and let the best matches come to you.')}</p>
        <form id="projectForm">
          <div class="form-grid">
            <label><span class="field-label">${state.lang === 'ur' ? 'عنوان' : 'Title'}</span><input name="title" type="text" placeholder="${state.lang === 'ur' ? 'مثلاً ecommerce store' : 'ecommerce store'}" required /></label>
            <label><span class="field-label">${state.lang === 'ur' ? 'شہر' : 'City'}</span><select name="city">${cities.filter((city) => city !== 'All Cities').map((city) => `<option value="${escapeHtml(city)}">${escapeHtml(city)}</option>`).join('')}</select></label>
            <label><span class="field-label">${state.lang === 'ur' ? 'بجٹ' : 'Budget'}</span><input name="budget" type="text" placeholder="PKR 25,000 - 40,000" required /></label>
            <label><span class="field-label">${state.lang === 'ur' ? 'ڈیڈ لائن' : 'Due'}</span><input name="due" type="text" placeholder="3 days" required /></label>
            <label class="span-2"><span class="field-label">${state.lang === 'ur' ? 'Skills' : 'Skills'}</span><input name="skills" type="text" placeholder="WordPress, Figma, SEO" /></label>
            <label class="span-2"><span class="field-label">${state.lang === 'ur' ? 'تفصیل' : 'Description'}</span><textarea name="description" placeholder="Write a clear brief..." required></textarea></label>
          </div>
          <div class="form-actions"><button class="btn btn--primary" type="submit">${escapeHtml(t('project'))}</button></div>
        </form>
      </section>
    </div>
  `;
}

function renderInbox() {
  const thread = currentThread();
  return `
    <div class="view-intro">
      <div>
        <p class="eyebrow">${escapeHtml(state.lang === 'ur' ? 'کلائنٹ گفتگو' : 'Messages')}</p>
        <h3>${escapeHtml(state.lang === 'ur' ? 'پیغامات ایک جگہ رکھیں اور جلد جواب دیں۔' : 'Keep chats with buyers and teams in one place.')}</h3>
      </div>
      <div class="summary-pill">${state.threads.length} ${state.lang === 'ur' ? 'گفتگو' : 'conversations'}</div>
    </div>
    <div class="sections-grid">
      <section class="section-block">
        <div class="section-head"><h3>Conversations</h3><span class="summary-pill">${state.threads.length} ${state.lang === 'ur' ? 'گفتگو' : 'conversations'}</span></div>
        <div class="thread-list">
          ${state.threads.length ? state.threads.map((item) => `<article class="thread-card ${item.id === thread.id ? 'is-selected' : ''}" data-action="open-thread" data-id="${item.id}"><div class="thread-header"><strong>${escapeHtml(item.name)}</strong><span class="thread-time">${escapeHtml(item.time)}</span></div><p class="gig-category">${escapeHtml(item.city)} · ${escapeHtml(item.role)}</p><p class="thread-snippet">${escapeHtml(item.last)}</p></article>`).join('') : `<p class="section-note">${escapeHtml(t('noThreads') || 'No chats yet.')}</p>`}
        </div>
      </section>
      <section class="conversation">
        <div class="section-head"><div><h3>${escapeHtml(thread.name)}</h3><p class="project-desc">${escapeHtml(thread.city)} · ${escapeHtml(thread.role)}</p></div><span class="status-badge status-badge--warning">${escapeHtml(t('threadHint'))}</span></div>
        <div class="conversation-log">
          ${thread.messages.length ? thread.messages.map((message) => `<div class="bubble ${message.from === 'you' ? 'bubble--outgoing' : 'bubble--incoming'}">${escapeHtml(message.text)}</div>`).join('') : `<p class="section-note">${escapeHtml(t('noMessages') || 'No messages yet.')}</p>`}
        </div>
        <form id="replyForm">
          <label><span class="field-label">${state.lang === 'ur' ? 'جواب' : 'Reply'}</span><textarea name="reply" placeholder="${state.lang === 'ur' ? 'مختصر جواب لکھیں...' : 'Write a short reply...'}" required></textarea></label>
          <div class="form-actions"><button class="btn btn--primary" type="submit">${escapeHtml(state.lang === 'ur' ? 'جواب بھیجیں' : 'Send reply')}</button></div>
        </form>
      </section>
    </div>
  `;
}

function renderWallet() {
  const wallet = state.wallet;
  return `
    <div class="view-intro">
      <div>
        <p class="eyebrow">${escapeHtml(state.lang === 'ur' ? 'آمدنی اور ادائیگیاں' : 'Payments')}</p>
        <h3>${escapeHtml(state.lang === 'ur' ? 'لوکل پے منٹس کے ذریعے اپنی رقم کا بہاؤ دیکھیں۔' : 'Track available balance, pending funds, and payouts in one place.')}</h3>
      </div>
      <div class="summary-pill">${escapeHtml(wallet.payoutMethod)}</div>
    </div>
    <div class="wallet-grid">
      <article class="wallet-card">
        <p class="wallet-sub">Available</p>
        <span class="price">${money.format(wallet.available)}</span>
        <p class="wallet-note">${escapeHtml(t('walletHint'))}</p>
        <div class="wallet-meta"><span>${state.orders.length} ${state.lang === 'ur' ? 'آرڈرز' : 'orders'}</span><span>${state.projects.length} ${state.lang === 'ur' ? 'بریفز' : 'briefs'}</span></div>
      </article>
      <article class="wallet-card">
        <p class="wallet-sub">Pending</p>
        <span class="price">${money.format(wallet.pending)}</span>
        <p class="wallet-note">${escapeHtml(state.lang === 'ur' ? 'جو رقم کل clear ہوگی' : 'Money queued for release.')}</p>
        <div class="chip-stack">${payoutMethods.map((method) => `<span class="chip">${escapeHtml(method)}</span>`).join('')}</div>
      </article>
      <article class="wallet-card wallet-card--wide">
        <div class="section-head">
          <div>
            <h3>${escapeHtml(t('withdraw'))}</h3>
            <p class="project-desc">${escapeHtml(t('withdrawHint'))}</p>
          </div>
          <span class="status-badge">${escapeHtml(wallet.payoutMethod)}</span>
        </div>
        <form id="withdrawForm">
          <div class="form-grid">
            <label><span class="field-label">${state.lang === 'ur' ? 'رقم' : 'Amount'}</span><input name="amount" type="number" min="5000" step="1000" placeholder="10000" required /></label>
            <label><span class="field-label">${state.lang === 'ur' ? 'پے آؤٹ میتھڈ' : 'Payout method'}</span><select name="method">${payoutMethods.map((method) => `<option value="${escapeHtml(method)}">${escapeHtml(method)}</option>`).join('')}</select></label>
          </div>
          <div class="form-actions"><button class="btn btn--primary" type="submit">${escapeHtml(t('withdraw'))}</button></div>
        </form>
      </article>
      <article class="wallet-card wallet-card--wide">
        <div class="section-head"><h3>Recent payouts</h3><span class="summary-pill">${wallet.requests.length} ${state.lang === 'ur' ? 'ادائیگیاں' : 'payouts'}</span></div>
        <div class="wallet-list">
          ${wallet.requests.map((request) => `<div class="order-card"><div class="section-head"><strong>${escapeHtml(request.method)}</strong><span class="status-badge ${request.status === 'Completed' ? 'status-badge--muted' : 'status-badge--warning'}">${escapeHtml(request.status)}</span></div><div class="wallet-meta"><span>${money.format(request.amount)}</span><span>${escapeHtml(request.time)}</span></div></div>`).join('')}
        </div>
      </article>
    </div>
  `;
}

function renderStudio() {
  const gigs = state.customGigs.length ? state.customGigs : baseGigs.slice(0, 3);
  const profile = state.profile || defaultSellerProfile();
  const profileSkills = parseSkills(profile.skills);
  return `
    <div class="view-intro">
      <div>
        <p class="eyebrow">${escapeHtml(state.lang === 'ur' ? 'سیلر اسٹوڈیو' : 'Seller studio')}</p>
        <h3>${escapeHtml(state.lang === 'ur' ? 'گگز شائع کریں اور پروفائل بہتر رکھیں۔' : 'Create service listings that stand out in local search.')}</h3>
      </div>
      <div class="summary-pill">${gigs.length} ${state.lang === 'ur' ? 'سروسز' : 'services'}</div>
    </div>
    <div class="studio-grid">
      <article class="studio-card">
        <p class="eyebrow">${escapeHtml(t('sellerProfile'))}</p>
        <h3>${escapeHtml(profile.displayName || 'Manal Khan')}</h3>
        <p class="project-desc">${escapeHtml(profile.city || 'Lahore')} &middot; Verified seller &middot; Response time 1 hour</p>
        <div class="stat-row"><span>4.9 rating</span><span>93% completion</span><span>24h delivery avg</span></div>
        <div class="chip-stack">${(profileSkills.length ? profileSkills : ['WordPress', 'Figma', 'SEO', 'Urdu support']).map((skill) => `<span class="chip">${escapeHtml(skill)}</span>`).join('')}</div>
      </article>
      <article class="studio-card">
        <p class="eyebrow">${escapeHtml(t('gigFormTitle'))}</p>
        <h3>${escapeHtml(t('gigFormHint'))}</h3>
        <form id="gigForm">
          <div class="form-grid">
            <label class="span-2"><span class="field-label">${state.lang === 'ur' ? 'عنوان' : 'Title'}</span><input name="title" type="text" placeholder="${state.lang === 'ur' ? 'مثلاً logo design' : 'logo design'}" required /></label>
            <label><span class="field-label">${state.lang === 'ur' ? 'شہر' : 'City'}</span><select name="city">${cities.filter((city) => city !== 'All Cities').map((city) => `<option value="${escapeHtml(city)}">${escapeHtml(city)}</option>`).join('')}</select></label>
            <label><span class="field-label">${state.lang === 'ur' ? 'کیٹیگری' : 'Category'}</span><select name="category">${categories.filter((category) => category !== 'All Categories').map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join('')}</select></label>
            <label><span class="field-label">PKR</span><input name="price" type="number" min="5000" step="1000" placeholder="25000" required /></label>
            <label><span class="field-label">${state.lang === 'ur' ? 'ڈے' : 'Days'}</span><input name="delivery" type="number" min="1" max="14" step="1" placeholder="3" required /></label>
            <label class="span-2"><span class="field-label">${state.lang === 'ur' ? 'ٹیگز' : 'Tags'}</span><input name="tags" type="text" placeholder="Branding, Reels, Urdu" /></label>
            <label class="span-2"><span class="field-label">${state.lang === 'ur' ? 'تفصیل' : 'Description'}</span><textarea name="description" placeholder="Describe the service, timeline, and what the buyer gets..." required></textarea></label>
          </div>
          <div class="form-actions"><button class="btn btn--primary" type="submit">${escapeHtml(t('publishGig'))}</button></div>
        </form>
      </article>
      <article class="studio-card" style="grid-column:1/-1;">
        <div class="section-head"><h3>${escapeHtml(t('yourGigs'))}</h3><span class="summary-pill">${state.customGigs.length} ${state.lang === 'ur' ? 'سروسز' : 'services'}</span></div>
        <div class="gig-grid">
          ${gigs.length ? gigs.map((gig) => `<article class="gig-card"><div class="section-head"><strong>${escapeHtml(gig.title)}</strong><span class="status-badge">${escapeHtml(gig.city)}</span></div><p class="gig-desc">${escapeHtml(gig.description)}</p><div class="gig-meta"><span>${escapeHtml(gig.category)}</span><span>${money.format(gig.price)}</span><span>${gig.delivery} days</span></div></article>`).join('') : `<p class="section-note">${escapeHtml(t('noGigs'))}</p>`}
        </div>
      </article>
    </div>
  `;
}

function renderView() {
  if (state.view === 'dashboard') {
    els.panelTitle.textContent = state.lang === 'ur' ? 'ڈیش بورڈ' : 'Dashboard';
    els.panelLead.textContent = state.lang === 'ur' ? 'آپ کا ورک اسپیس ایک نظر میں۔' : 'Your workspace at a glance.';
    els.viewPanel.innerHTML = renderDashboardView();
    return;
  }
  if (state.view === 'marketplace') {
    els.panelTitle.textContent = state.lang === 'ur' ? 'مارکیٹ پلیس' : 'Marketplace';
    els.panelLead.textContent = t('panel');
    els.viewPanel.innerHTML = renderMarketplace();
    return;
  }
  if (state.view === 'projects') {
    els.panelTitle.textContent = state.lang === 'ur' ? 'پروجیکٹس' : 'Briefs';
    els.panelLead.textContent = state.lang === 'ur' ? 'کھلے کام، پوسٹ کیے گئے briefs، اور اگلا موقع ٹریک کریں۔' : 'Track live briefs, active orders, and your next opportunity.';
    els.viewPanel.innerHTML = renderProjects();
    return;
  }
  if (state.view === 'inbox') {
    els.panelTitle.textContent = state.lang === 'ur' ? 'ان باکس' : 'Chats';
    els.panelLead.textContent = state.lang === 'ur' ? 'پیغامات ایک جگہ رکھیں اور جلد جواب دیں۔' : 'Keep chats with buyers and teams in one place.';
    els.viewPanel.innerHTML = renderInbox();
    return;
  }
  if (state.view === 'wallet') {
    els.panelTitle.textContent = state.lang === 'ur' ? 'والیٹ' : 'Wallet';
    els.panelLead.textContent = state.lang === 'ur' ? 'لوکل پے منٹس کے ذریعے اپنی رقم کا بہاؤ دیکھیں۔' : 'Track available balance, pending funds, and payout activity.';
    els.viewPanel.innerHTML = renderWallet();
    return;
  }
  els.panelTitle.textContent = state.lang === 'ur' ? 'اسٹوڈیو' : 'Studio';
  els.panelLead.textContent = state.lang === 'ur' ? 'گگز شائع کریں اور پروفائل بہتر رکھیں۔' : 'Publish services that stand out in local search.';
  els.viewPanel.innerHTML = renderStudio();
}

function render() {
  document.documentElement.lang = state.lang;
  syncStaticCopy();
  syncCategoryRail();
  renderTabs();
  renderView();
  els.resultCount.textContent = String(filteredGigs().length);
  els.savedCount.textContent = String(state.savedIds.length);
}

function toggleSave(id) {
  if (!requireAuth('login', state.lang === 'ur' ? 'محفوظ کرنے کے لیے سائن ان کریں۔' : 'Sign in to save services.')) {
    return;
  }
  const saved = new Set(state.savedIds);
  const isRemoving = saved.has(id);
  if (isRemoving) {
    saved.delete(id);
  } else {
    saved.add(id);
  }
  state.savedIds = [...saved];
  saveJSON(STORAGE_KEYS.savedIds, state.savedIds);
  render();
  showToast(isRemoving ? (state.lang === 'ur' ? 'Gig محفوظ سے ہٹ گیا' : 'Removed from bookmarks') : (state.lang === 'ur' ? 'Gig محفوظ ہوگیا' : 'Saved to bookmarks'));
}

function orderGig(id) {
  if (!requireAuth('login', state.lang === 'ur' ? 'آرڈر دینے کے لیے سائن ان کریں۔' : 'Sign in to place an order.')) {
    return;
  }
  const gig = activeGigs().find((item) => item.id === id);
  if (!gig) return;
  state.orders.unshift({
    id: `order-${Date.now()}`,
    title: gig.title,
    buyer: 'You',
    freelancer: gig.seller,
    budget: money.format(gig.price),
    status: 'Placed',
    due: `${gig.delivery} days`,
  });
  saveJSON(STORAGE_KEYS.orders, state.orders);
  state.view = 'projects';
  render();
  showToast(state.lang === 'ur' ? 'آرڈر پلیس ہو گیا' : 'Order placed');
}

function selectThread(id) {
  state.selectedThreadId = id;
  render();
}

function submitProject(form) {
  if (!requireAuth('signup', state.lang === 'ur' ? 'brief پوسٹ کرنے کے لیے اکاؤنٹ بنائیں۔' : 'Create an account to post a brief.')) {
    return;
  }
  const data = new FormData(form);
  state.projects.unshift({
    id: `project-${Date.now()}`,
    title: String(data.get('title') || '').trim(),
    city: String(data.get('city') || 'Karachi'),
    budget: String(data.get('budget') || '').trim(),
    due: String(data.get('due') || '').trim(),
    bids: 0,
    status: 'Open',
    skills: String(data.get('skills') || '').split(',').map((item) => item.trim()).filter(Boolean),
    description: String(data.get('description') || '').trim(),
  });
  saveJSON(STORAGE_KEYS.projects, state.projects);
  state.view = 'projects';
  render();
  form.reset();
  showToast(state.lang === 'ur' ? 'بریف شائع ہوگیا' : 'Brief posted');
}

function submitGig(form) {
  if (!requireAuth('signup', state.lang === 'ur' ? 'سروس شائع کرنے کے لیے اکاؤنٹ بنائیں۔' : 'Create an account to publish a service.')) {
    return;
  }
  const data = new FormData(form);
  const sellerName = state.profile?.displayName || state.profile?.name || 'Manal Khan';
  state.customGigs.unshift({
    id: `custom-gig-${Date.now()}`,
    title: String(data.get('title') || '').trim(),
    seller: sellerName,
    city: String(data.get('city') || 'Karachi'),
    category: String(data.get('category') || 'Web Development'),
    price: Number(data.get('price') || 0),
    delivery: Number(data.get('delivery') || 3),
    rating: 5,
    reviews: 0,
    verified: false,
    tags: String(data.get('tags') || '').split(',').map((item) => item.trim()).filter(Boolean),
    description: String(data.get('description') || '').trim(),
  });
  saveJSON(STORAGE_KEYS.customGigs, state.customGigs);
  state.view = 'studio';
  render();
  form.reset();
  showToast(state.lang === 'ur' ? 'سروس شائع ہوگئی' : 'Service published');
}

function submitReply(form) {
  if (!requireAuth('login', state.lang === 'ur' ? 'پیغام بھیجنے کے لیے سائن ان کریں۔' : 'Sign in to reply.')) {
    return;
  }
  const thread = currentThread();
  const data = new FormData(form);
  const reply = String(data.get('reply') || '').trim();
  if (!reply) return;
  thread.messages.push({ from: 'you', text: reply });
  thread.last = reply;
  thread.time = 'just now';
  saveJSON(STORAGE_KEYS.threads, state.threads);
  render();
  form.reset();
  showToast(state.lang === 'ur' ? 'جواب بھیج دیا گیا' : 'Reply sent');
}

function submitWithdraw(form) {
  if (!requireAuth('login', state.lang === 'ur' ? 'پے آؤٹ کے لیے سائن ان کریں۔' : 'Sign in to request a payout.')) {
    return;
  }
  const data = new FormData(form);
  const amount = Number(data.get('amount') || 0);
  const method = String(data.get('method') || state.wallet.payoutMethod);
  if (!amount || amount < 5000) {
    showToast(state.lang === 'ur' ? 'کم از کم 5000 رکھیں' : 'Use at least PKR 5,000');
    return;
  }
  if (amount > state.wallet.available) {
    showToast(state.lang === 'ur' ? 'Available balance کم ہے' : 'Not enough available balance');
    return;
  }
  state.wallet.available -= amount;
  state.wallet.pending += amount;
  state.wallet.payoutMethod = method;
  state.wallet.requests.unshift({ method, amount, status: 'Queued', time: 'Just now' });
  saveJSON(STORAGE_KEYS.wallet, state.wallet);
  render();
  form.reset();
  showToast(`${money.format(amount)} payout queued via ${method}`);
}

function resetDemoData() {
  localStorage.removeItem(STORAGE_KEYS.savedIds);
  localStorage.removeItem(STORAGE_KEYS.customGigs);
  localStorage.removeItem(STORAGE_KEYS.projects);
  localStorage.removeItem(STORAGE_KEYS.orders);
  localStorage.removeItem(STORAGE_KEYS.threads);
  localStorage.removeItem(STORAGE_KEYS.wallet);
  localStorage.removeItem(STORAGE_KEYS.lang);

  state.lang = 'en';
  state.view = 'marketplace';
  state.search = '';
  state.city = 'All Cities';
  state.category = 'All Categories';
  state.maxBudget = 60000;
  state.selectedThreadId = null;
  state.savedIds = [];
  state.customGigs = [];
  state.projects = clone(baseProjects);
  state.orders = clone(baseOrders);
  state.threads = clone(baseThreads);
  state.wallet = clone(defaultWallet);
  state.selectedThreadId = state.threads[0]?.id || null;
  render();
  showToast(state.lang === 'ur' ? 'Demo reset ہوگیا' : 'Demo data reset');
}

function applySearch(query) {
  state.search = String(query || '').trim();
  state.view = 'marketplace';
  render();
  const target = document.getElementById('marketplace');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function applyCategory(category) {
  state.search = '';
  state.category = category;
  state.view = 'marketplace';
  render();
  const target = document.getElementById('marketplace');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function syncCategoryRail() {
  if (!els.categoryRail) {
    return;
  }

  els.categoryRail.querySelectorAll('[data-category-pick]').forEach((button) => {
    const active = button.dataset.categoryPick === state.category;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function bindEvents() {
  els.langToggle.addEventListener('click', () => {
    state.lang = state.lang === 'en' ? 'ur' : 'en';
    localStorage.setItem(STORAGE_KEYS.lang, state.lang);
    render();
    showToast(state.lang === 'ur' ? 'زبان اردو ہوگئی' : 'Language switched to English');
  });

  els.navSignin?.addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  els.navStart?.addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('spotlight')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  els.heroPostProject.addEventListener('click', () => {
    document.getElementById('spotlight')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  els.quickHireBtn.addEventListener('click', () => {
    setView('projects');
  });

  els.quickGigBtn.addEventListener('click', () => {
    window.location.href = 'gig-builder.html';
  });

  if (els.heroSearchForm) {
    els.heroSearchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      applySearch(els.heroSearchInput?.value || '');
    });
  }

  if (els.heroPills) {
    els.heroPills.addEventListener('click', (event) => {
      const button = event.target.closest('[data-hero-query]');
      if (!button) {
        return;
      }

      applySearch(button.dataset.heroQuery || '');
    });
  }

  if (els.categoryRail) {
    els.categoryRail.addEventListener('click', (event) => {
      const button = event.target.closest('[data-category-pick]');
      if (!button) {
        return;
      }

      applyCategory(button.dataset.categoryPick || 'All Categories');
    });
  }

  els.searchInput.addEventListener('input', (event) => {
    state.search = event.target.value;
    if (els.heroSearchInput) {
      els.heroSearchInput.value = state.search;
    }
    renderView();
    els.resultCount.textContent = String(filteredGigs().length);
  });

  els.citySelect.addEventListener('change', (event) => {
    state.city = event.target.value;
    render();
  });

  els.categorySelect.addEventListener('change', (event) => {
    state.category = event.target.value;
    render();
  });

  els.budgetRange.addEventListener('input', (event) => {
    state.maxBudget = Number(event.target.value);
    els.budgetValue.textContent = money.format(state.maxBudget);
    renderView();
    els.resultCount.textContent = String(filteredGigs().length);
  });

  els.viewTabs.addEventListener('click', (event) => {
    const button = event.target.closest('[data-view]');
    if (button) {
      state.view = button.dataset.view;
      render();
    }
  });

  els.viewPanel.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) {
      const viewButton = event.target.closest('[data-view]');
      if (viewButton) {
        setView(viewButton.dataset.view);
      }
      return;
    }
    const { action, id } = button.dataset;
    if (action === 'save') toggleSave(id);
    if (action === 'order') orderGig(id);
    if (action === 'open-thread') selectThread(id);
  });

  els.viewPanel.addEventListener('submit', (event) => {
    const form = event.target;
    if (form.id === 'projectForm') {
      event.preventDefault();
      submitProject(form);
    }
    if (form.id === 'gigForm') {
      event.preventDefault();
      submitGig(form);
    }
    if (form.id === 'replyForm') {
      event.preventDefault();
      submitReply(form);
    }
    if (form.id === 'withdrawForm') {
      event.preventDefault();
      submitWithdraw(form);
    }
  });

  els.resetDemo.addEventListener('click', resetDemoData);
}

function init() {
  state.selectedThreadId = state.threads[0]?.id || null;
  state.city = cities.includes(state.city) ? state.city : 'All Cities';
  state.category = categories.includes(state.category) ? state.category : 'All Categories';
  bindEvents();
  render();
  showToast('PakGigs ready');
}

init();
