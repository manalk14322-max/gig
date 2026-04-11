const STORAGE_KEYS = {
  googleUser: 'pakgigs.googleUser',
  onboardingDraft: 'pakgigs.onboardingDraft',
  sellerProfile: 'pakgigs.sellerProfile',
};

const steps = Array.from(document.querySelectorAll('.onboarding-step'));
const stepCount = document.getElementById('onboardingStepCount');
const stepLabel = document.getElementById('onboardingStepLabel');
const displayNameInput = document.getElementById('displayNameInput');
const usernameInput = document.getElementById('usernameInput');
const headlineInput = document.getElementById('headlineInput');
const citySelect = document.getElementById('citySelect');
const skillsInput = document.getElementById('skillsInput');
const bioInput = document.getElementById('bioInput');
const usernameNext = document.getElementById('usernameNext');
const finishButton = document.getElementById('finishButton');
const roleCards = Array.from(document.querySelectorAll('.choice-card'));
const previewAvatar = document.getElementById('previewAvatar');
const previewName = document.getElementById('previewName');
const previewHandle = document.getElementById('previewHandle');
const previewTitle = document.getElementById('previewTitle');
const previewBio = document.getElementById('previewBio');
const previewSkills = document.getElementById('previewSkills');

let draft = null;
let selectedRole = null;

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

function getSuggestedUsername(name, email) {
  const preferred = String(name || '').trim() || String(email || '').split('@')[0] || 'seller';
  const slug = slugify(preferred);
  return slug || 'your-name';
}

function initials(value) {
  const parts = String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (!parts.length) return 'PK';
  return parts
    .map((part) => part[0].toUpperCase())
    .join('');
}

function parseSkills(value) {
  return String(value || '')
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function setStep(index) {
  steps.forEach((step, stepIndex) => {
    step.hidden = stepIndex !== index;
  });

  if (stepCount) {
    stepCount.textContent = index === 0 ? '1 of 2' : '2 of 2';
  }

  if (stepLabel) {
    stepLabel.textContent = index === 0 ? 'Choose your identity' : 'Finish your profile';
  }

  if (finishButton && index === 1) {
    finishButton.disabled = !selectedRole;
  }
}

function syncRoleCards() {
  roleCards.forEach((card) => {
    const active = card.getAttribute('data-role') === selectedRole;
    card.classList.toggle('is-active', active);
    card.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function saveDraft(updates = {}) {
  draft = {
    ...(draft || {}),
    ...updates,
  };
  writeJSON(STORAGE_KEYS.onboardingDraft, draft);
}

function currentValues() {
  return {
    displayName: String(displayNameInput?.value || '').trim(),
    username: String(usernameInput?.value || '').trim(),
    headline: String(headlineInput?.value || '').trim(),
    city: String(citySelect?.value || 'Karachi'),
    skills: parseSkills(skillsInput?.value || ''),
    bio: String(bioInput?.value || '').trim(),
  };
}

function renderPreview() {
  const values = currentValues();
  const profileName = values.displayName || draft?.name || 'Manal Khan';
  const profileHandle = `@${values.username || draft?.suggestedUsername || 'manal-khan'}`;
  const profileHeadline = values.headline || 'Add a short title';
  const profileBio =
    values.bio || 'Share a short introduction buyers can trust when they visit your profile.';
  const skillList = values.skills.length ? values.skills : ['Add skills'];

  if (previewAvatar) {
    const picture = draft?.picture;
    previewAvatar.textContent = picture ? '' : initials(profileName);
    previewAvatar.style.backgroundImage = picture ? `url(${picture})` : '';
    previewAvatar.style.backgroundSize = picture ? 'cover' : '';
    previewAvatar.style.backgroundPosition = picture ? 'center' : '';
  }

  if (previewName) previewName.textContent = profileName;
  if (previewHandle) previewHandle.textContent = profileHandle;
  if (previewTitle) previewTitle.textContent = profileHeadline;
  if (previewBio) previewBio.textContent = profileBio;

  if (previewSkills) {
    previewSkills.innerHTML = skillList
      .map((skill) => `<span class="chip">${skill.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`)
      .join('');
  }
}

function loadDraft() {
  draft = readJSON(STORAGE_KEYS.onboardingDraft) || readJSON(STORAGE_KEYS.googleUser);
  if (!draft) {
    window.location.href = 'seller-signup.html';
    return;
  }

  const legacyFullName = ['Hassan', 'Ali'].join(' ');
  const legacyBrandName = ['Your', 'Fiverr', 'Name'].join(' ');
  const legacyShortName = ['Your', 'name'].join(' ');
  if (draft.name === legacyFullName || draft.name === legacyBrandName || draft.name === legacyShortName) {
    draft.name = 'Manal Khan';
  }
  if (draft.email === ['hassan', 'example.com'].join('@')) {
    draft.email = 'manal@example.com';
  }
  if (draft.suggestedUsername === ['hassan', 'ali'].join('-') || draft.suggestedUsername === ['km', '9606430'].join('')) {
    draft.suggestedUsername = 'manal-khan';
  }
  if (!draft.role) {
    draft.role = 'seller';
  }

  if (!draft.suggestedUsername) {
    draft.suggestedUsername = getSuggestedUsername(draft.name, draft.email);
  }

  if (displayNameInput) {
    displayNameInput.value = draft.displayName || draft.name || '';
  }
  if (usernameInput) {
    usernameInput.value = draft.username || draft.suggestedUsername;
  }
  if (headlineInput) {
    headlineInput.value = draft.headline || 'WordPress developer and SEO writer';
  }
  if (citySelect) {
    citySelect.value = draft.city || 'Karachi';
  }
  if (skillsInput) {
    skillsInput.value = Array.isArray(draft.skills) ? draft.skills.join(', ') : draft.skills || 'WordPress, SEO, Figma';
  }
  if (bioInput) {
    bioInput.value =
      draft.bio || 'I help businesses build clean, trustworthy, and high-converting digital experiences.';
  }

  selectedRole = draft.role === 'client' || draft.role === 'seller' ? draft.role : 'seller';
  syncRoleCards();
  renderPreview();
  setStep(0);
}

function completeProfile() {
  const values = currentValues();
  const profile = {
    ...draft,
    displayName: values.displayName || draft?.name || '',
    username: values.username || draft?.suggestedUsername || 'your-name',
    headline: values.headline || 'WordPress developer and SEO writer',
    city: values.city,
    skills: values.skills,
    bio: values.bio,
    role: selectedRole,
    completedAt: new Date().toISOString(),
  };

  writeJSON(STORAGE_KEYS.sellerProfile, profile);
  writeJSON(STORAGE_KEYS.onboardingDraft, profile);

  if (selectedRole === 'client') {
    window.location.href = 'index.html#marketplace';
    return;
  }

  window.location.href = 'gig-builder.html';
}

function focusFirstInvalid() {
  if (!displayNameInput?.value.trim()) {
    displayNameInput?.focus();
    displayNameInput?.classList.add('is-invalid');
    window.setTimeout(() => displayNameInput?.classList.remove('is-invalid'), 600);
    return true;
  }

  if (!usernameInput?.value.trim()) {
    usernameInput?.focus();
    usernameInput?.classList.add('is-invalid');
    window.setTimeout(() => usernameInput?.classList.remove('is-invalid'), 600);
    return true;
  }

  return false;
}

function wireEvents() {
  usernameNext?.addEventListener('click', () => {
    if (focusFirstInvalid()) return;
    saveDraft(currentValues());
    setStep(1);
    finishButton?.focus();
  });

  [displayNameInput, usernameInput, headlineInput, citySelect, skillsInput, bioInput].forEach((field) => {
    field?.addEventListener('input', () => {
      field.classList.remove('is-invalid');
      saveDraft(currentValues());
      renderPreview();
    });
  });

  roleCards.forEach((card) => {
    card.addEventListener('click', () => {
      selectedRole = card.getAttribute('data-role') === 'client' ? 'client' : 'seller';
      saveDraft({ ...currentValues(), role: selectedRole });
      syncRoleCards();
      if (finishButton) {
        finishButton.disabled = false;
      }
    });
  });

  finishButton?.addEventListener('click', () => {
    if (finishButton.disabled) return;
    completeProfile();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadDraft();
  wireEvents();
});
