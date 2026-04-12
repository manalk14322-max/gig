import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import { createUser, findUserByEmail, findUserById } from '../lib/devStore.js';

const router = express.Router();
const CAMPUS_OTP = '123456';
const CAMPUS_ALLOWED_DOMAINS = [
  'giki.edu.pk',
  'nust.edu.pk',
  'lums.edu.pk',
  'pu.edu.pk',
  'comsats.edu.pk',
  'vu.edu.pk',
  'uol.edu.pk',
];
const pendingCampusOtps = new Map();

function signToken(user) {
  return jwt.sign(
    { id: user._id || user.id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '7d' },
  );
}

function normalizeUser(user) {
  return {
    id: user._id?.toString?.() || user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title || '',
    location: user.location || '',
    avatarUrl: user.avatarUrl || '',
    description: user.description || '',
    skills: user.skills || [],
    portfolio: user.portfolio || [],
    university: user.university || '',
    universityEmail: user.universityEmail || '',
    department: user.department || '',
    studentId: user.studentId || '',
    verificationStatus: user.verificationStatus || 'pending',
    verifiedStudent: Boolean(user.verifiedStudent || user.verificationStatus === 'verified'),
    verificationHistory: user.verificationHistory || [],
  };
}

function getEmailDomain(email = '') {
  const parts = String(email).trim().toLowerCase().split('@');
  return parts.length === 2 ? parts[1] : '';
}

function isCampusEmail(email = '') {
  const domain = getEmailDomain(email);
  return CAMPUS_ALLOWED_DOMAINS.some((allowed) => domain === allowed || domain.endsWith(`.${allowed}`));
}

function issueCampusOtp(email) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  pendingCampusOtps.set(normalizedEmail, {
    code: CAMPUS_OTP,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });
  return CAMPUS_OTP;
}

async function sendCampusOtpEmail(toEmail, otp) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    return { delivered: false, reason: 'EMAIL_USER/EMAIL_PASS missing' };
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
  await transporter.sendMail({
    from: user,
    to: toEmail,
    subject: 'Your UniHire campus verification code',
    html: `
      <div style="background:#F4F6FB;padding:32px 0;font-family:Inter,Arial,sans-serif;color:#111827;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:20px;box-shadow:0 20px 60px rgba(15,23,42,0.08);overflow:hidden;">
          <tr>
            <td style="padding:28px 32px;background:linear-gradient(135deg,#1E3A8A,#6D28D9);color:#ffffff;">
              <p style="margin:0;font-size:14px;letter-spacing:0.3em;text-transform:uppercase;">UniHire</p>
              <h1 style="margin:12px 0 0;font-size:28px;line-height:1.2;">Campus Verification Code</h1>
              <p style="margin:8px 0 0;font-size:14px;opacity:0.85;">Secure your verified student badge in minutes.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 16px;font-size:15px;color:#4B5563;">Use the OTP below to verify your university email. This code is valid for 10 minutes.</p>
              <div style="display:inline-block;background:#EEF2FF;border-radius:14px;padding:14px 22px;font-size:22px;font-weight:700;letter-spacing:0.2em;color:#1E3A8A;">
                ${otp}
              </div>
              <p style="margin:20px 0 0;font-size:13px;color:#6B7280;">If you did not request this code, please ignore this email.</p>
              <div style="margin-top:24px;padding-top:16px;border-top:1px solid #E5E7EB;font-size:12px;color:#9CA3AF;">
                UniHire • Pakistan's verified student marketplace
              </div>
            </td>
          </tr>
        </table>
      </div>
    `,
  });
  return { delivered: true };
}

function consumeCampusOtp(email, otp) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const entry = pendingCampusOtps.get(normalizedEmail);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    pendingCampusOtps.delete(normalizedEmail);
    return false;
  }
  if (String(otp || '').trim() !== entry.code) return false;
  pendingCampusOtps.delete(normalizedEmail);
  return true;
}

router.post('/signup', async (req, res) => {
  const {
    name,
    email,
    password,
    role = 'buyer',
    title = '',
    location = 'Pakistan',
    university = '',
    universityEmail = '',
    department = '',
    studentId = '',
  } = req.body;

  const trimmedName = (name || '').trim();
  const normalizedEmail = (email || '').trim().toLowerCase();
  const normalizedUniversityEmail = (universityEmail || '').trim().toLowerCase();

  if (!trimmedName || !normalizedEmail || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const safeRole = role === 'seller' ? 'seller' : 'buyer';
  if (safeRole === 'seller') {
    if (!normalizedUniversityEmail) {
      return res.status(400).json({ error: 'University email is required for seller accounts.' });
    }
    if (!isCampusEmail(normalizedUniversityEmail)) {
      return res.status(400).json({
        error:
          'Use an approved Pakistani university email (e.g. giki.edu.pk, nust.edu.pk, lums.edu.pk, pu.edu.pk).',
      });
    }
  }

  const dbReady = req.app.locals.dbReady === true;
  if (dbReady) {
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      passwordHash,
      role: safeRole,
      title,
      location,
      university,
      universityEmail: normalizedUniversityEmail,
      department,
      studentId,
      verifiedStudent: false,
      verificationStatus: 'pending',
    });
    if (safeRole === 'seller') {
      const otp = issueCampusOtp(normalizedEmail);
      await sendCampusOtpEmail(normalizedUniversityEmail || normalizedEmail, otp).catch(() => {});
    }
    return res.json({
      token: signToken(user),
      user: normalizeUser(user),
      verificationRequired: safeRole === 'seller',
      verificationHint:
        safeRole === 'seller'
          ? 'Use the demo campus OTP 123456 to verify your student account.'
          : '',
    });
  }

  const existing = findUserByEmail(normalizedEmail);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  const user = createUser({
    name: trimmedName,
    email: normalizedEmail,
    passwordHash: bcrypt.hashSync(password, 10),
    role: safeRole,
    title,
    location,
    university,
    universityEmail: normalizedUniversityEmail,
    department,
    studentId,
  });
  if (safeRole === 'seller') {
    const otp = issueCampusOtp(normalizedEmail);
    await sendCampusOtpEmail(normalizedUniversityEmail || normalizedEmail, otp).catch(() => {});
  }
  return res.json({
    token: signToken(user),
    user: normalizeUser(user),
    verificationRequired: safeRole === 'seller',
    verificationHint:
      safeRole === 'seller'
        ? 'Use the demo campus OTP 123456 to verify your student account.'
        : '',
  });
});

router.post('/verify-campus', async (req, res) => {
  const { email, otp } = req.body;
  const normalizedEmail = (email || '').trim().toLowerCase();
  if (!normalizedEmail || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required.' });
  }
  if (!consumeCampusOtp(normalizedEmail, otp)) {
    return res.status(400).json({ error: 'Invalid or expired OTP.' });
  }

  const dbReady = req.app.locals.dbReady === true;
  if (dbReady) {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.verifiedStudent = true;
    user.verificationStatus = 'verified';
    user.verificationHistory = [
      ...(user.verificationHistory || []),
      {
        status: 'verified',
        note: 'Campus OTP verified.',
        decidedAt: new Date(),
        decidedBy: 'system',
      },
    ];
    await user.save();
    return res.json({
      message: 'Campus verification complete.',
      user: normalizeUser(user),
    });
  }

  const user = findUserByEmail(normalizedEmail);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.verifiedStudent = true;
  user.verificationStatus = 'verified';
  user.verificationHistory = [
    ...(user.verificationHistory || []),
    {
      status: 'verified',
      note: 'Campus OTP verified.',
      decidedAt: new Date().toISOString(),
      decidedBy: 'system',
    },
  ];
  return res.json({
    message: 'Campus verification complete.',
    user: normalizeUser(user),
  });
});

router.post('/resend-campus', async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = (email || '').trim().toLowerCase();
  if (!normalizedEmail) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  if (!isCampusEmail(normalizedEmail)) {
    return res.status(400).json({
      error:
        'Use an approved Pakistani university email (e.g. giki.edu.pk, nust.edu.pk, lums.edu.pk, pu.edu.pk).',
    });
  }
  const otp = issueCampusOtp(normalizedEmail);
  await sendCampusOtpEmail(normalizedEmail, otp).catch(() => {});
  return res.json({
    message: 'OTP resent. Use 123456 to verify your campus account.',
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = (email || '').trim().toLowerCase();
  if (!normalizedEmail || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  const dbReady = req.app.locals.dbReady === true;
  if (dbReady) {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    return res.json({ token: signToken(user), user: normalizeUser(user) });
  }

  const user = findUserByEmail(normalizedEmail);
  if (!user) {
    const created = createUser({
      name: normalizedEmail.split('@')[0] || 'Demo User',
      email: normalizedEmail,
      passwordHash: bcrypt.hashSync(password, 10),
      role: 'buyer',
    });
    return res.json({ token: signToken(created), user: normalizeUser(created) });
  }
  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  return res.json({ token: signToken(user), user: normalizeUser(user) });
});

router.get('/me', async (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  if (!token) return res.json({ user: null });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const dbReady = req.app.locals.dbReady === true;
    if (dbReady) {
      const user = await User.findById(payload.id);
      if (!user) return res.json({ user: null });
      return res.json({ user: normalizeUser(user) });
    }
    const user = findUserById(payload.id);
    if (!user) return res.json({ user: null });
    return res.json({ user: normalizeUser(user) });
  } catch {
    res.json({ user: null });
  }
});

router.get('/google', (_req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(501).json({
      error:
        'Google OAuth not configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the server .env to enable it.',
    });
  }
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || `http://localhost:${process.env.PORT || 5050}/api/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account',
  });
  return res.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
});

router.get('/google/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).json({ error: 'Missing OAuth code.' });
  }
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(501).json({ error: 'Google OAuth credentials missing.' });
  }

  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || `http://localhost:${process.env.PORT || 5050}/api/auth/google/callback`;

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(code),
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      return res.status(400).json({ error: tokenData.error_description || 'Google token exchange failed.' });
    }

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await userRes.json();
    if (!userRes.ok) {
      return res.status(400).json({ error: 'Failed to read Google profile.' });
    }

    const email = String(profile.email || '').toLowerCase();
    const name = profile.name || profile.given_name || 'Google User';
    if (!email) return res.status(400).json({ error: 'Google email missing.' });

    const dbReady = req.app.locals.dbReady === true;
    let user;
    if (dbReady) {
      user = await User.findOne({ email });
      if (!user) {
        const passwordHash = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);
        user = await User.create({
          name,
          email,
          passwordHash,
          role: 'buyer',
          verificationStatus: 'pending',
          verifiedStudent: false,
        });
      }
    } else {
      user = findUserByEmail(email);
      if (!user) {
        user = createUser({
          name,
          email,
          passwordHash: bcrypt.hashSync(crypto.randomBytes(16).toString('hex'), 10),
          role: 'buyer',
        });
      }
    }

    const token = signToken(user);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    return res.redirect(`${clientUrl}/oauth?token=${token}`);
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Google OAuth failed.' });
  }
});

export default router;
