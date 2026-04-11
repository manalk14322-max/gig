const STORAGE_KEYS = {
  sellerProfile: 'pakgigs.sellerProfile',
  onboardingDraft: 'pakgigs.onboardingDraft',
  googleUser: 'pakgigs.googleUser',
  customGigs: 'pakgigs.customGigs',
  projects: 'pakgigs.projects',
  orders: 'pakgigs.orders',
  threads: 'pakgigs.threads',
};

const defaultServices = [
  {
    title: 'WordPress store setup with Urdu support',
    seller: 'Amina Shah',
    city: 'Lahore',
    price: 'PKR 38,000',
    delivery: '3 days',
    rating: '4.9',
    category: 'tech',
    description: 'Launch a clean online store with mobile-friendly pages, fast checkout, and local payments.',
    tags: ['WordPress', 'Ecommerce', 'SEO ready'],
  },
  {
    title: 'Brand identity for startups and shops',
    seller: 'Hira Malik',
    city: 'Islamabad',
    price: 'PKR 25,000',
    delivery: '3 days',
    rating: '4.9',
    category: 'design',
    description: 'A sharp identity system for new businesses that need polished visuals for launch.',
    tags: ['Logo', 'Style guide', 'Social kit'],
  },
  {
    title: 'SEO audit in English and Urdu',
    seller: 'Zain Raza',
    city: 'Rawalpindi',
    price: 'PKR 32,000',
    delivery: '5 days',
    rating: '4.8',
    category: 'marketing',
    description: 'Improve rankings with a practical audit for Pakistani service brands and stores.',
    tags: ['Technical SEO', 'Keyword map', 'Local search'],
  },
  {
    title: 'Short-form video edits for Reels and TikTok',
    seller: 'Bilal Ahmed',
    city: 'Karachi',
    price: 'PKR 18,000',
    delivery: '2 days',
    rating: '4.8',
    category: 'video',
    description: 'Punchy social clips with clean subtitles, motion text, and a simple brand style.',
    tags: ['Captions', 'Subtitles', 'Brand pack'],
  },
];

const defaultProjects = [
  {
    title: 'Need an ecommerce store for ladies clothing',
    city: 'Karachi',
    budget: 'PKR 40,000 - 60,000',
    due: '3 days',
    bids: 18,
    status: 'Open',
    skills: ['WordPress', 'UI', 'Payments'],
  },
  {
    title: 'Logo and social kit for a bakery',
    city: 'Lahore',
    budget: 'PKR 15,000 - 20,000',
    due: '2 days',
    bids: 11,
    status: 'Open',
    skills: ['Branding', 'Instagram', 'Packaging'],
  },
];

const defaultOrders = [
  {
    title: 'WordPress store setup with Urdu support',
    buyer: 'Sana Textiles',
    freelancer: 'Amina Shah',
    budget: 'PKR 38,000',
    status: 'In progress',
    due: '3 days',
  },
  {
    title: 'Brand identity for startups and shops',
    buyer: 'Northstar Cafe',
    freelancer: 'Hira Malik',
    budget: 'PKR 25,000',
    status: 'Awaiting revision',
    due: '1 day',
  },
];

const defaultThreads = [
  {
    name: 'Sana Textiles',
    city: 'Karachi',
    last: 'Can we add JazzCash checkout too?',
    time: '2m',
  },
  {
    name: 'Northstar Cafe',
    city: 'Lahore',
    last: 'The logo direction looks great. One more round of tweaks?',
    time: '18m',
  },
];

const state = {
  query: '',
  category: 'all',
  profile: loadProfile(),
  services: loadJSON(STORAGE_KEYS.customGigs, defaultServices),
  projects: loadJSON(STORAGE_KEYS.projects, defaultProjects),
  orders: loadJSON(STORAGE_KEYS.orders, defaultOrders),
  threads: loadJSON(STORAGE_KEYS.threads, defaultThreads),
};

const els = {
  mobileSubtitle: document.getElementById('mobileSubtitle'),
  searchForm: document.getElementById('searchForm'),
  searchInput: document.getElementById('searchInput'),
  categoryRail: document.getElementById('categoryRail'),
  clearFilters: document.getElementById('clearFilters'),
  completionRing: document.getElementById('completionRing'),
  completionValue: document.getElementById('completionValue'),
  completionLabel: document.getElementById('completionLabel'),
  heroProfileTitle: document.getElementById('heroProfileTitle'),
  heroProfileMeta: document.getElementById('heroProfileMeta'),
  heroCountsTitle: document.getElementById('heroCountsTitle'),
  heroCountsMeta: document.getElementById('heroCountsMeta'),
  profileAvatar: document.getElementById('profileAvatar'),
  profileName: document.getElementById('profileName'),
  profileHandle: document.getElementById('profileHandle'),
  profileLocation: document.getElementById('profileLocation'),
  profileJoined: document.getElementById('profileJoined'),
  profileMode: document.getElementById('profileMode'),
  profileNote: document.getElementById('profileNote'),
  drawerAvatar: document.getElementById('drawerAvatar'),
  drawerName: document.getElementById('drawerName'),
  drawerEmail: document.getElementById('drawerEmail'),
  accountAvatar: document.getElementById('accountAvatar'),
  accountButton: document.getElementById('accountButton'),
  menuButton: document.getElementById('menuButton'),
  accountDrawer: document.getElementById('accountDrawer'),
  serviceList: document.getElementById('serviceList'),
  briefList: document.getElementById('briefList'),
  orderList: document.getElementById('orderList'),
  threadList: document.getElementById('threadList'),
  serviceCount: document.getElementById('serviceCount'),
  overviewProgress: document.getElementById('overviewProgress'),
  overviewText: document.getElementById('overviewText'),
  mobileBottomNav: document.querySelector('.mobile-bottom-nav'),
};

function loadJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function loadProfile() {
  return (
    loadJSON(STORAGE_KEYS.sellerProfile, null) ||
    loadJSON(STORAGE_KEYS.onboardingDraft, null) ||
    loadJSON(STORAGE_KEYS.googleUser, null) || {
      displayName: 'Manal Khan',
      username: 'manal-khan',
      email: 'manal@example.com',
      city: 'Pakistan',
      headline: 'Seller profile',
      bio: 'Create a tailored seller profile to help buyers trust you faster.',
      skills: ['WordPress', 'SEO', 'Figma'],
      role: 'seller',
    }
  );
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function initials(value) {
  const parts = String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (!parts.length) return 'PG';
  return parts.map((part) => part[0].toUpperCase()).join('');
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/['".]+/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24);
}

function parseSkills(value) {
  if (Array.isArray(value)) return value.filter(Boolean).slice(0, 6);
  return String(value || '')
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function formatJoined(dateValue) {
  if (!dateValue) {
    return 'Joined April 2026';
  }

  try {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return 'Joined April 2026';
    }

    return `Joined ${new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(date)}`;
  } catch {
    return 'Joined April 2026';
  }
}

function profileLabel(profile) {
  return profile.role === 'seller' ? 'Seller profile' : 'Client profile';
}

function profileCompletion(profile) {
  let points = 0;
  const checks = [
    profile.displayName || profile.name,
    profile.username || profile.suggestedUsername,
    profile.headline,
    profile.city,
    parseSkills(profile.skills).length,
    profile.bio,
  ];

  if (checks[0]) points += 20;
  if (checks[1]) points += 20;
  if (checks[2]) points += 20;
  if (checks[3]) points += 10;
  if (checks[4]) points += 20;
  if (checks[5]) points += 10;

  return Math.min(points, 100);
}

function normalizeCategory(value) {
  const text = String(value || '').toLowerCase();

  if (!text) return 'all';
  if (text === 'all') return 'all';
  if (text.includes('graphic') || text.includes('design')) return 'design';
  if (text.includes('web') || text.includes('program') || text.includes('code') || text.includes('app') || text.includes('tech')) {
    return 'tech';
  }
  if (text.includes('seo') || text.includes('market') || text.includes('social')) return 'marketing';
  if (text.includes('video') || text.includes('animation') || text.includes('reel') || text.includes('tiktok')) return 'video';
  if (text.includes('write') || text.includes('translation') || text.includes('content') || text.includes('urdu')) return 'writing';
  if (text.includes('business') || text.includes('finance') || text.includes('consult')) return 'business';
  return 'all';
}

function categoryLabel(value) {
  switch (normalizeCategory(value)) {
    case 'design':
      return 'Graphics & Design';
    case 'tech':
      return 'Programming & Tech';
    case 'marketing':
      return 'Digital Marketing';
    case 'video':
      return 'Video & Animation';
    case 'writing':
      return 'Writing & Translation';
    case 'business':
      return 'Business';
    default:
      return 'Trending';
  }
}

function currentProfile() {
  const profile = state.profile || {};
  const displayName = profile.displayName || profile.name || 'Manal Khan';
  const username = profile.username || profile.suggestedUsername || slugify(displayName) || 'manal-khan';
  const email = profile.email || 'manal@example.com';
  const city = profile.city || 'Pakistan';
  const headline = profile.headline || 'Client and freelancer profile';
  const bio = profile.bio || 'Create a tailored profile to help buyers trust you faster.';
  const skills = parseSkills(profile.skills);
  const joined = formatJoined(profile.completedAt || profile.createdAt);
  const role = profile.role === 'seller' ? 'seller' : 'client';

  return {
    displayName,
    username,
    email,
    city,
    headline,
    bio,
    skills: skills.length ? skills : ['WordPress', 'SEO', 'Figma'],
    joined,
    role,
  };
}

function setActiveRail(category) {
  if (!els.categoryRail) return;
  els.categoryRail.querySelectorAll('[data-filter]').forEach((button) => {
    const active = button.dataset.filter === category;
    button.classList.toggle('is-active', active);
  });
}

function matchesService(service) {
  const query = state.query.trim().toLowerCase();
  const category = state.category;
  const haystack = [
    service.title,
    service.seller,
    service.city,
    service.description,
    ...(service.tags || []),
  ]
    .join(' ')
    .toLowerCase();

  const queryMatch = !query || haystack.includes(query);
  const categoryMatch = category === 'all' || normalizeCategory(service.category) === category;
  return queryMatch && categoryMatch;
}

function formatPrice(value) {
  if (value === null || value === undefined || value === '') {
    return 'PKR 0';
  }

  if (typeof value === 'number') {
    return `PKR ${new Intl.NumberFormat('en-PK').format(value)}`;
  }

  const text = String(value).trim();
  if (/^pkr/i.test(text)) {
    return text;
  }

  if (/^\d[\d,]*$/.test(text)) {
    return `PKR ${text}`;
  }

  return text;
}

function formatDelivery(value) {
  if (value === null || value === undefined || value === '') {
    return '3 days';
  }

  if (typeof value === 'number') {
    return `${value} day${value === 1 ? '' : 's'}`;
  }

  const text = String(value).trim();
  if (/^\d+$/.test(text)) {
    const number = Number(text);
    return `${number} day${number === 1 ? '' : 's'}`;
  }

  if (/day/i.test(text)) {
    return text;
  }

  return `${text} days`;
}

function renderServiceCards() {
  const cards = state.services.filter(matchesService);
  if (!els.serviceList) return;

  if (!cards.length) {
    els.serviceList.innerHTML = `
      <article class="service-card">
        <p class="eyebrow">No results</p>
        <h3>No matches found.</h3>
        <p class="service-copy">Try a different search or choose another category from the rail above.</p>
      </article>
    `;
    els.serviceCount.textContent = '0 services shown';
    return;
  }

  els.serviceCount.textContent = `${cards.length} service${cards.length === 1 ? '' : 's'} shown`;
  els.serviceList.innerHTML = cards
    .map(
      (service, index) => `
        <article class="service-card">
          <div class="service-card__top">
            <span class="service-badge">${escapeHtml(service.categoryLabel || categoryLabel(service.category))}</span>
            <button class="service-save" type="button" aria-label="Save ${escapeHtml(service.title)}">
              ${index % 2 === 0 ? '♡' : '★'}
            </button>
          </div>
          <h3>${escapeHtml(service.title)}</h3>
          <div class="service-meta">
            <span>${escapeHtml(service.seller)}</span>
            <span>${escapeHtml(service.city)}</span>
            <span>${escapeHtml(formatDelivery(service.delivery))} delivery</span>
          </div>
          <p class="service-copy">${escapeHtml(service.description || 'A clean service listing built for local clients.')}</p>
          <div class="service-tags">
            ${((service.tags && service.tags.length ? service.tags : [service.category, service.city])
              || [])
              .map((tag) => `<span>${escapeHtml(tag)}</span>`)
              .join('')}
          </div>
          <div class="service-footer">
            <div>
              <span class="service-price">${escapeHtml(formatPrice(service.price))}</span>
              <span class="service-rating">${escapeHtml(service.rating || '4.8')} rating</span>
            </div>
            <a class="service-cta" href="index.html#spotlight">View</a>
          </div>
        </article>
      `,
    )
    .join('');
}

function renderBriefCards() {
  if (!els.briefList) return;
  els.briefList.innerHTML = state.projects
    .map(
      (project) => `
        <article class="stack-item">
          <div class="stack-row">
            <div>
              <h3>${escapeHtml(project.title)}</h3>
              <div class="stack-meta">
                <span>${escapeHtml(project.city)}</span>
                <span>${escapeHtml(project.budget)}</span>
                <span>${escapeHtml(project.due)} left</span>
              </div>
            </div>
            <span class="service-badge">${escapeHtml(project.status)}</span>
          </div>
          <div class="stack-badges">
            ${(project.skills || [])
              .map((skill) => `<span>${escapeHtml(skill)}</span>`)
              .join('')}
          </div>
        </article>
      `,
    )
    .join('');
}

function renderOrderCards() {
  if (!els.orderList) return;
  els.orderList.innerHTML = state.orders
    .map(
      (order) => `
        <article class="stack-item">
          <div class="stack-row">
            <div>
              <h3>${escapeHtml(order.title)}</h3>
              <div class="stack-meta">
                <span>${escapeHtml(order.buyer)}</span>
                <span>${escapeHtml(order.freelancer)}</span>
              </div>
            </div>
            <span class="service-badge">${escapeHtml(order.status)}</span>
          </div>
          <div class="stack-badges">
            <span>${escapeHtml(order.budget)}</span>
            <span>${escapeHtml(order.due)} left</span>
          </div>
        </article>
      `,
    )
    .join('');
}

function renderThreadCards() {
  if (!els.threadList) return;
  els.threadList.innerHTML = state.threads
    .map(
      (thread) => `
        <article class="chat-card">
          <div class="chat-row">
            <div class="chat-avatar">${initials(thread.name)}</div>
            <div class="chat-body">
              <strong>${escapeHtml(thread.name)}</strong>
              <div class="chat-meta">
                <span>${escapeHtml(thread.city)}</span>
                <span>${escapeHtml(thread.time)} ago</span>
              </div>
              <p>${escapeHtml(thread.last)}</p>
            </div>
          </div>
        </article>
      `,
    )
    .join('');
}

function renderProfile() {
  const profile = currentProfile();
  const completion = profileCompletion(state.profile || {});

  document.title = `PakGigs Mobile | ${profileLabel(profile)}`;
  if (els.mobileSubtitle) {
    els.mobileSubtitle.textContent = profileLabel(profile);
  }

  if (els.accountAvatar) {
    els.accountAvatar.textContent = initials(profile.displayName);
  }
  if (els.profileAvatar) {
    els.profileAvatar.textContent = initials(profile.displayName);
  }
  if (els.drawerAvatar) {
    els.drawerAvatar.textContent = initials(profile.displayName);
  }
  if (els.profileName) {
    els.profileName.textContent = profile.displayName;
  }
  if (els.profileHandle) {
    els.profileHandle.textContent = `@${profile.username}`;
  }
  if (els.profileLocation) {
    els.profileLocation.textContent = profile.city;
  }
  if (els.profileJoined) {
    els.profileJoined.textContent = profile.joined;
  }
  if (els.profileMode) {
    els.profileMode.textContent = profile.role === 'seller' ? 'Public seller profile' : 'Public profile';
  }
  if (els.profileNote) {
    els.profileNote.textContent = profile.bio;
  }
  if (els.drawerName) {
    els.drawerName.textContent = profile.displayName;
  }
  if (els.drawerEmail) {
    els.drawerEmail.textContent = profile.email;
  }
  if (els.heroProfileTitle) {
    els.heroProfileTitle.textContent =
      profile.role === 'seller'
        ? 'Your seller profile is ready to grow.'
        : 'Your profile is ready to share.';
  }
  if (els.heroProfileMeta) {
    els.heroProfileMeta.textContent = `Use ${profile.city} as your public location and keep your profile polished.`;
  }
  if (els.heroCountsTitle) {
    els.heroCountsTitle.textContent = `${state.projects.length} briefs • ${state.orders.length} orders`;
  }
  if (els.heroCountsMeta) {
    els.heroCountsMeta.textContent = `${state.services.length} services available in your mobile view.`;
  }
  if (els.completionRing) {
    els.completionRing.style.setProperty('--progress', `${completion}%`);
  }
  if (els.completionValue) {
    els.completionValue.textContent = `${completion}%`;
  }
  if (els.completionLabel) {
    els.completionLabel.textContent = completion >= 80 ? 'Profile' : 'Progress';
  }
  if (els.overviewProgress) {
    els.overviewProgress.style.width = `${completion}%`;
  }
  if (els.overviewText) {
    els.overviewText.textContent =
      completion >= 80
        ? 'Your public profile is nearly ready. Keep your headline and skills sharp.'
        : 'Add more details to make your profile feel complete and trustworthy.';
  }
}

function render() {
  renderProfile();
  renderServiceCards();
  renderBriefCards();
  renderOrderCards();
  renderThreadCards();
  setActiveRail(state.category);
}

function openDrawer() {
  if (!els.accountDrawer) return;
  els.accountDrawer.hidden = false;
  requestAnimationFrame(() => {
    els.accountDrawer.classList.add('is-open');
  });
  els.accountButton?.setAttribute('aria-expanded', 'true');
}

function closeDrawer() {
  if (!els.accountDrawer) return;
  els.accountDrawer.classList.remove('is-open');
  els.accountButton?.setAttribute('aria-expanded', 'false');
  window.setTimeout(() => {
    if (els.accountDrawer) {
      els.accountDrawer.hidden = true;
    }
  }, 180);
}

function scrollToSelector(selector) {
  const target = document.querySelector(selector);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function setCategory(category) {
  state.category = category;
  renderServiceCards();
  setActiveRail(category);
}

function clearFilters() {
  state.query = '';
  state.category = 'all';
  if (els.searchInput) {
    els.searchInput.value = '';
  }
  renderServiceCards();
  setActiveRail('all');
}

function bindEvents() {
  els.searchForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    state.query = String(els.searchInput?.value || '').trim();
    renderServiceCards();
    scrollToSelector('#feed');
  });

  els.searchInput?.addEventListener('input', (event) => {
    state.query = String(event.target.value || '').trim();
    renderServiceCards();
  });

  els.categoryRail?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    setCategory(button.dataset.filter || 'all');
  });

  els.clearFilters?.addEventListener('click', clearFilters);

  document.addEventListener('click', (event) => {
    const scrollTarget = event.target.closest('[data-scroll]');
    if (scrollTarget) {
      event.preventDefault();
      scrollToSelector(scrollTarget.dataset.scroll);
    }

    const closeTarget = event.target.closest('[data-close]');
    if (closeTarget) {
      closeDrawer();
    }
  });

  els.accountButton?.addEventListener('click', () => {
    if (els.accountDrawer?.hidden) {
      openDrawer();
    } else {
      closeDrawer();
    }
  });

  els.menuButton?.addEventListener('click', () => {
    if (els.accountDrawer?.hidden) {
      openDrawer();
      return;
    }

    closeDrawer();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeDrawer();
    }
  });

  els.mobileBottomNav?.addEventListener('click', (event) => {
    const link = event.target.closest('[data-scroll]');
    if (!link) return;
    const buttons = Array.from(els.mobileBottomNav.querySelectorAll('a, button'));
    buttons.forEach((item) => item.classList.remove('is-active'));
    link.classList.add('is-active');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  bindEvents();
  render();
});
