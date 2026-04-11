const CONFIG = window.PAKGIGS_CONFIG || {};
const STORAGE_KEYS = {
  googleUser: 'pakgigs.googleUser',
  onboardingDraft: 'pakgigs.onboardingDraft',
  sellerProfile: 'pakgigs.sellerProfile',
};

const googleMount = document.getElementById('googleButtonMount');
const googleStatus = document.getElementById('googleStatus');
const emailForm = document.querySelector('.signup-email-form');
const submitButton = document.querySelector('.signup-submit');

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

function setStatus(message, tone = 'neutral') {
  if (!googleStatus) return;
  googleStatus.textContent = message;
  googleStatus.dataset.tone = tone;
}

function saveDraft(profile) {
  writeJSON(STORAGE_KEYS.googleUser, profile);
  writeJSON(STORAGE_KEYS.onboardingDraft, {
    provider: profile.provider || 'google',
    name: profile.name || '',
    email: profile.email || '',
    picture: profile.picture || '',
    suggestedUsername: getSuggestedUsername(profile.name, profile.email),
  });
}

async function exchangeGoogleCredential(credential) {
  setStatus('Checking your Google account...', 'busy');
  const response = await fetch('/api/auth/google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ credential }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Unable to verify Google sign-in.');
  }

  const user = {
    ...data.user,
    provider: 'google',
  };

  saveDraft(user);
  setStatus('Google account verified. Redirecting...', 'success');
  window.setTimeout(() => {
    window.location.href = 'seller-onboarding.html';
  }, 450);
}

function renderGoogleButton() {
  if (!googleMount) return;

  if (!CONFIG.googleClientId) {
    googleMount.innerHTML = `
      <div class="signup-google-fallback">
        <strong>Google sign-in is not configured yet.</strong>
        <p>Add <code>GOOGLE_CLIENT_ID</code> on the server to enable real OAuth.</p>
        <button class="signup-google-demo" type="button" id="demoGoogleButton">Continue with Google demo</button>
      </div>
    `;
    setStatus('Demo mode is active until Google OAuth is configured.', 'busy');
    document.getElementById('demoGoogleButton')?.addEventListener('click', () => {
      const demoUser = {
        provider: 'google',
        name: 'Manal Khan',
        email: 'manal@example.com',
        picture: '',
        suggestedUsername: 'manal-khan',
        role: 'seller',
      };
      saveDraft(demoUser);
      setStatus('Demo Google account loaded. Redirecting...', 'success');
      window.setTimeout(() => {
        window.location.href = 'seller-onboarding.html';
      }, 450);
    });
    return;
  }

  if (!window.google || !window.google.accounts || !window.google.accounts.id) {
    window.setTimeout(renderGoogleButton, 100);
    return;
  }

  window.google.accounts.id.initialize({
    client_id: CONFIG.googleClientId,
    callback: (response) => {
      if (!response.credential) {
        setStatus('Google did not return a credential.', 'error');
        return;
      }

      exchangeGoogleCredential(response.credential).catch((error) => {
        setStatus(error.message || 'Google sign-in failed.', 'error');
      });
    },
    auto_select: false,
    cancel_on_tap_outside: true,
    context: 'signup',
  });

  window.google.accounts.id.renderButton(googleMount, {
    theme: 'outline',
    size: 'large',
    text: 'signup_with',
    shape: 'pill',
    logo_alignment: 'left',
    width: Math.max(320, Math.min(420, googleMount.clientWidth || 360)),
  });
}

function wireEmailFallback() {
  if (!emailForm || !submitButton) return;

  emailForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(emailForm);
    const draft = {
      provider: 'email',
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      role: String(data.get('role') || 'seller'),
      suggestedUsername: getSuggestedUsername(data.get('name'), data.get('email')),
    };

    const password = String(data.get('password') || '').trim();

    if (!draft.name || !draft.email || !password) {
      setStatus('Please fill in your name, email, and password.', 'error');
      return;
    }

    writeJSON(STORAGE_KEYS.onboardingDraft, draft);
    writeJSON(STORAGE_KEYS.googleUser, draft);
    submitButton.disabled = true;
    submitButton.textContent = 'Profile ready';
    setStatus('Email draft saved. Opening profile setup...', 'success');
    window.setTimeout(() => {
      window.location.href = 'seller-onboarding.html';
    }, 450);
  });
}

function hydrateExistingDraft() {
  const existing = readJSON(STORAGE_KEYS.onboardingDraft);
  if (existing?.suggestedUsername && googleStatus) {
    setStatus(`Continue with ${existing.provider === 'google' ? 'Google' : 'email'} to finish your seller profile.`, 'neutral');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  hydrateExistingDraft();
  wireEmailFallback();
  renderGoogleButton();
});
