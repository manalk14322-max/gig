const STORAGE_KEYS = {
  sellerProfile: 'pakgigs.sellerProfile',
  onboardingDraft: 'pakgigs.onboardingDraft',
  googleUser: 'pakgigs.googleUser',
  customGigs: 'pakgigs.customGigs',
  draft: 'pakgigs.gigBuilderDraft',
};

const CATEGORY_OPTIONS = [
  'Web Development',
  'Graphic Design',
  'Digital Marketing',
  'Video Editing',
  'Writing & Translation',
  'AI Services',
  'Business',
  'Finance',
];

const CITY_OPTIONS = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Multan', 'Faisalabad', 'Hyderabad'];

const form = document.getElementById('gigBuilderForm');
const builderMessage = document.getElementById('builderMessage');
const workflowTitle = document.getElementById('workflowTitle');
const workflowLead = document.getElementById('workflowLead');
const workflowStepLabel = document.getElementById('workflowStepLabel');
const workflowProgressFill = document.getElementById('workflowProgressFill');
const builderStepCount = document.getElementById('builderStepCount');
const builderCompletion = document.getElementById('builderCompletion');
const profileSummaryName = document.getElementById('profileSummaryName');
const profileSummaryHandle = document.getElementById('profileSummaryHandle');
const previewAvatar = document.getElementById('previewAvatar');
const previewSellerName = document.getElementById('previewSellerName');
const previewSellerMeta = document.getElementById('previewSellerMeta');
const previewTitle = document.getElementById('previewTitle');
const previewSummary = document.getElementById('previewSummary');
const previewTags = document.getElementById('previewTags');
const previewPriceHint = document.getElementById('previewPriceHint');
const previewPackages = document.getElementById('previewPackages');
const previewGallery = document.getElementById('previewGallery');
const previewGalleryCount = document.getElementById('previewGalleryCount');
const previewChecklist = document.getElementById('previewChecklist');
const successCard = document.getElementById('successCard');
const successTitle = document.getElementById('successTitle');
const successBody = document.getElementById('successBody');
const builderStepPanels = Array.from(document.querySelectorAll('[data-step-panel]'));
const stepButtons = Array.from(document.querySelectorAll('[data-step-nav]'));
const prevStepBtn = document.getElementById('prevStepBtn');
const nextStepBtn = document.getElementById('nextStepBtn');
const saveDraftBtn = document.getElementById('saveDraftBtn');
const publishBtn = document.getElementById('publishBtn');

const fieldIds = [
  'gigTitle',
  'gigCategory',
  'gigCity',
  'gigLanguage',
  'gigTags',
  'gigSummary',
  'basicName',
  'basicPrice',
  'basicDelivery',
  'basicRevisions',
  'basicFeatures',
  'standardName',
  'standardPrice',
  'standardDelivery',
  'standardRevisions',
  'standardFeatures',
  'premiumName',
  'premiumPrice',
  'premiumDelivery',
  'premiumRevisions',
  'premiumFeatures',
  'gigDescription',
  'gigRequirements',
  'gigFaq',
  'gigThumbnail',
  'gigGallery1',
  'gigGallery2',
  'gigGallery3',
  'gigVideo',
  'gigFeatured',
];

const fields = Object.fromEntries(fieldIds.map((id) => [id, document.getElementById(id)]));
let sellerProfile = loadSellerProfile();
let draft = loadDraft();
let activeStep = Number(draft.activeStep || 0);

function readJSON(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/['".]+/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24);
}

function parseList(value) {
  return String(value || '')
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseLines(value) {
  return String(value || '')
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseFaq(value) {
  return parseLines(value).map((line) => {
    const [question, answer] = line.split('|');
    return {
      question: (question || '').trim(),
      answer: (answer || '').trim(),
    };
  });
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function loadSellerProfile() {
  return (
    readJSON(STORAGE_KEYS.sellerProfile) ||
    readJSON(STORAGE_KEYS.onboardingDraft) ||
    readJSON(STORAGE_KEYS.googleUser) || {
      displayName: 'Manal Khan',
      username: 'manal-khan',
      email: 'manal@example.com',
      city: 'Lahore',
      headline: 'Creative freelancer and WordPress expert',
      bio: 'I help brands build polished digital experiences.',
      skills: ['WordPress', 'SEO', 'Figma'],
      role: 'seller',
    }
  );
}

function defaultDraft() {
  return {
    gigTitle: 'I will design a modern WordPress website',
    gigCategory: 'Web Development',
    gigCity: sellerProfile.city || 'Lahore',
    gigLanguage: 'English and Urdu',
    gigTags: 'WordPress, SEO, Urdu support',
    gigSummary: 'A clean, modern website service that helps small businesses launch with confidence.',
    basicName: 'Starter',
    basicPrice: 15000,
    basicDelivery: 3,
    basicRevisions: 2,
    basicFeatures: 'Homepage setup, mobile responsiveness, contact form',
    standardName: 'Professional',
    standardPrice: 30000,
    standardDelivery: 5,
    standardRevisions: 3,
    standardFeatures: 'Homepage, inner pages, SEO basics, launch support',
    premiumName: 'Business',
    premiumPrice: 50000,
    premiumDelivery: 7,
    premiumRevisions: 5,
    premiumFeatures: 'Full website, copy polish, priority support, final review',
    gigDescription:
      'I build polished websites with a premium feel, clear structure, and a smooth buyer experience. Every gig is made to look trustworthy and local-friendly.',
    gigRequirements: 'Brand name\nWebsite goal\nReference links\nPreferred colors\nAny content you already have',
    gigFaq:
      'What do you need from me? | Brand assets, content, and a clear goal.\nCan you work in Urdu? | Yes, I can deliver in English and Urdu.\nHow fast can you start? | I usually start within one working day.',
    gigThumbnail: '',
    gigGallery1: '',
    gigGallery2: '',
    gigGallery3: '',
    gigVideo: '',
    gigFeatured: true,
    activeStep: 0,
  };
}

function loadDraft() {
  return {
    ...defaultDraft(),
    ...(readJSON(STORAGE_KEYS.draft) || {}),
  };
}

function showMessage(message, tone = 'neutral') {
  if (!builderMessage) return;
  builderMessage.hidden = !message;
  builderMessage.textContent = message;
  builderMessage.dataset.tone = tone;
}

function setFieldValue(id, value) {
  const field = fields[id];
  if (!field) return;
  if (field.type === 'checkbox') {
    field.checked = Boolean(value);
    return;
  }
  field.value = value ?? '';
}

function hydrateForm() {
  const state = {
    ...defaultDraft(),
    ...draft,
    gigCategory: draft.gigCategory || 'Web Development',
    gigCity: draft.gigCity || sellerProfile.city || 'Lahore',
  };

  CATEGORY_OPTIONS.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    fields.gigCategory.appendChild(option);
  });

  CITY_OPTIONS.forEach((city) => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    fields.gigCity.appendChild(option);
  });

  fieldIds.forEach((id) => setFieldValue(id, state[id]));
  fields.gigCategory.value = state.gigCategory;
  fields.gigCity.value = state.gigCity;
}

function collectValues() {
  const values = {};
  fieldIds.forEach((id) => {
    const field = fields[id];
    if (!field) return;
    values[id] = field.type === 'checkbox' ? field.checked : field.value;
  });
  return values;
}

function saveDraft() {
  draft = {
    ...draft,
    ...collectValues(),
    activeStep,
  };
  writeJSON(STORAGE_KEYS.draft, draft);
  showMessage('Draft saved locally on this browser.', 'success');
}

function stepMeta(step) {
  return (
    [
      ['Basics', 'Start with a clear title, category, and city.'],
      ['Packages', 'Make comparison easy with clear package tiers.'],
      ['Details', 'Explain the service and collect requirements.'],
      ['Gallery', 'Add visuals and publish the gig.'],
    ][step] || ['Basics', 'Start with a clear title, category, and city.']
  );
}

function setStep(step) {
  activeStep = Math.max(0, Math.min(3, step));
  builderStepPanels.forEach((panel, index) => {
    panel.hidden = index !== activeStep;
  });
  stepButtons.forEach((button, index) => {
    button.classList.toggle('is-active', index === activeStep);
  });
  const [title, lead] = stepMeta(activeStep);
  workflowTitle.textContent = title;
  workflowLead.textContent = lead;
  workflowStepLabel.textContent = `Step ${activeStep + 1}`;
  builderStepCount.textContent = `${activeStep + 1} of 4`;
  workflowProgressFill.style.width = `${((activeStep + 1) / 4) * 100}%`;
  prevStepBtn.disabled = activeStep === 0;
  nextStepBtn.hidden = activeStep === 3;
  publishBtn.hidden = activeStep !== 3;
  draft.activeStep = activeStep;
  writeJSON(STORAGE_KEYS.draft, { ...draft, activeStep });
}

function packageData(prefix) {
  return {
    name: String(fields[`${prefix}Name`].value || '').trim() || defaultDraft()[`${prefix}Name`],
    price: Number(fields[`${prefix}Price`].value || 0),
    delivery: Number(fields[`${prefix}Delivery`].value || 0),
    revisions: Number(fields[`${prefix}Revisions`].value || 0),
    features: parseList(fields[`${prefix}Features`].value),
  };
}

function buildGig() {
  const values = collectValues();
  const packages = {
    basic: packageData('basic'),
    standard: packageData('standard'),
    premium: packageData('premium'),
  };
  const gallery = [values.gigThumbnail, values.gigGallery1, values.gigGallery2, values.gigGallery3].filter(Boolean);
  const sellerName = sellerProfile.displayName || 'Manal Khan';

  return {
    id: `custom-gig-${Date.now()}`,
    title: String(values.gigTitle || '').trim(),
    seller: sellerName,
    sellerHandle: sellerProfile.username || slugify(sellerName),
    city: String(values.gigCity || sellerProfile.city || 'Lahore'),
    category: String(values.gigCategory || 'Web Development'),
    price: packages.basic.price || packages.standard.price || packages.premium.price || 15000,
    delivery: packages.basic.delivery || packages.standard.delivery || packages.premium.delivery || 3,
    rating: 5,
    reviews: 0,
    verified: true,
    tags: parseList(values.gigTags),
    summary: String(values.gigSummary || '').trim(),
    description: String(values.gigDescription || '').trim(),
    language: String(values.gigLanguage || '').trim(),
    requirements: parseLines(values.gigRequirements),
    faq: parseFaq(values.gigFaq),
    packages,
    gallery,
    thumbnail: String(values.gigThumbnail || '').trim(),
    video: String(values.gigVideo || '').trim(),
    featured: Boolean(values.gigFeatured),
    createdAt: new Date().toISOString(),
  };
}

function validationState() {
  const values = collectValues();
  return {
    title: values.gigTitle.trim().length > 3,
    category: Boolean(values.gigCategory),
    city: Boolean(values.gigCity),
    language: values.gigLanguage.trim().length > 1,
    tags: parseList(values.gigTags).length > 0,
    summary: values.gigSummary.trim().length > 12,
    basicPrice: Number(values.basicPrice) > 0,
    basicDelivery: Number(values.basicDelivery) > 0,
    description: values.gigDescription.trim().length > 20,
    requirements: values.gigRequirements.trim().length > 0,
  };
}

function validateStep(step) {
  const state = validationState();
  const needs = [
    ['title', 'category', 'city', 'language', 'tags', 'summary'],
    ['basicPrice', 'basicDelivery'],
    ['description', 'requirements'],
    [],
  ][step];

  const firstInvalid = needs.find((key) => !state[key]);
  if (firstInvalid) {
    const copy = {
      title: 'Please add a gig title.',
      category: 'Please choose a category.',
      city: 'Please choose a city.',
      language: 'Please add a language.',
      tags: 'Please add at least one tag.',
      summary: 'Please write a short summary.',
      basicPrice: 'Add a price for the basic package.',
      basicDelivery: 'Add a delivery time for the basic package.',
      description: 'Write a gig description.',
      requirements: 'Add buyer requirements.',
    };
    showMessage(copy[firstInvalid] || 'Please complete this step.', 'error');
    return false;
  }

  showMessage('');
  return true;
}

function previewValues() {
  const values = collectValues();
  const packages = [packageData('basic'), packageData('standard'), packageData('premium')];
  const gallery = [values.gigThumbnail, values.gigGallery1, values.gigGallery2, values.gigGallery3].filter(Boolean);
  const completionChecks = validationState();
  const completion = Math.round((Object.values(completionChecks).filter(Boolean).length / Object.keys(completionChecks).length) * 100);

  previewAvatar.textContent =
    (sellerProfile.displayName || 'Manal Khan')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'MK';
  previewSellerName.textContent = sellerProfile.displayName || 'Manal Khan';
  previewSellerMeta.innerHTML = `${sellerProfile.city || 'Lahore'} &middot; Verified seller`;
  previewTitle.textContent = String(values.gigTitle || defaultDraft().gigTitle);
  previewSummary.textContent = String(values.gigSummary || defaultDraft().gigSummary);
  previewPriceHint.textContent = `Starting at PKR ${Number(packages[0].price || 0).toLocaleString('en-PK')}`;
  builderCompletion.textContent = `${completion}%`;

  if (profileSummaryName) profileSummaryName.textContent = sellerProfile.displayName || 'Manal Khan';
  if (profileSummaryHandle) profileSummaryHandle.textContent = `@${sellerProfile.username || slugify(sellerProfile.displayName || 'Manal Khan')}`;

  const tags = parseList(values.gigTags);
  previewTags.innerHTML = (tags.length ? tags.slice(0, 4) : ['WordPress', 'SEO', 'Urdu support'])
    .map((tag) => `<span class="preview-chip">${escapeHtml(tag)}</span>`)
    .join('');

  previewPackages.innerHTML = packages
    .map(
      (pkg, index) => `
        <div class="mini-package ${index === 0 ? 'mini-package--accent' : ''}">
          <strong>${pkg.name || 'Package'}</strong>
          <span>PKR ${Number(pkg.price || 0).toLocaleString('en-PK')} &middot; ${pkg.delivery || 0} days</span>
        </div>
      `,
    )
    .join('');

  previewGallery.innerHTML = gallery.length
    ? gallery
        .slice(0, 3)
        .map((item, index) => `<div class="gallery-slot">Image ${index + 1}<span>${escapeHtml(item)}</span></div>`)
        .join('')
    : `
      <div class="gallery-slot">Add cover image</div>
      <div class="gallery-slot">Add gallery image</div>
      <div class="gallery-slot">Add gallery image</div>
    `;
  previewGalleryCount.textContent = `${gallery.length} image${gallery.length === 1 ? '' : 's'}`;

  const checklistItems = [
    ['Title added', completionChecks.title],
    ['Packages set', completionChecks.basicPrice && completionChecks.basicDelivery],
    ['Description written', completionChecks.description],
    ['Gallery added', gallery.length > 0],
  ];

  previewChecklist.innerHTML = checklistItems
    .map(([label, done]) => `<li class="${done ? 'is-done' : ''}">${done ? '✓' : '•'} ${label}</li>`)
    .join('');
}

function publishGig(event) {
  event.preventDefault();

  if (!validateStep(0)) {
    setStep(0);
    return;
  }
  if (!validateStep(1)) {
    setStep(1);
    return;
  }
  if (!validateStep(2)) {
    setStep(2);
    return;
  }

  const gig = buildGig();
  const gigs = readJSON(STORAGE_KEYS.customGigs) || [];
  gigs.unshift(gig);
  writeJSON(STORAGE_KEYS.customGigs, gigs);

  if (successCard) successCard.hidden = false;
  if (successTitle) successTitle.textContent = gig.title || 'Your gig is live.';
  if (successBody) {
    successBody.textContent = `${gig.seller} published a new service in ${gig.city}. Open the marketplace to see it live.`;
  }

  draft = defaultDraft();
  writeJSON(STORAGE_KEYS.draft, draft);
  hydrateForm();
  setStep(0);
  previewValues();
  showMessage('Gig published successfully. It is now available in the marketplace.', 'success');
}

function wireEvents() {
  stepButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const step = Number(button.dataset.stepNav || 0);
      if (step > activeStep && !validateStep(activeStep)) return;
      setStep(step);
      previewValues();
    });
  });

  prevStepBtn.addEventListener('click', () => {
    setStep(activeStep - 1);
    previewValues();
  });

  nextStepBtn.addEventListener('click', () => {
    if (!validateStep(activeStep)) return;
    setStep(activeStep + 1);
    previewValues();
  });

  saveDraftBtn.addEventListener('click', () => {
    saveDraft();
    previewValues();
  });

  form.addEventListener('submit', publishGig);
  form.addEventListener('input', () => {
    draft = {
      ...draft,
      ...collectValues(),
      activeStep,
    };
    writeJSON(STORAGE_KEYS.draft, draft);
    previewValues();
  });
  form.addEventListener('change', () => {
    draft = {
      ...draft,
      ...collectValues(),
      activeStep,
    };
    writeJSON(STORAGE_KEYS.draft, draft);
    previewValues();
  });
}

function init() {
  hydrateForm();
  setStep(activeStep);
  previewValues();
  wireEvents();
  showMessage('Your draft is saved locally as you edit.', 'success');
}

init();
