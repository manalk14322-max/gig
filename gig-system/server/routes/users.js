import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import Gig from '../models/Gig.js';
import { findUserById, updateUser, listGigs } from '../lib/devStore.js';

const router = express.Router();

function isObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

// Get current user profile
router.get('/me', requireAuth, async (req, res) => {
  if (req.app.locals.dbReady === true) {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title,
      location: user.location,
      avatarUrl: user.avatarUrl,
      description: user.description,
      skills: user.skills || [],
      portfolio: user.portfolio || [],
      university: user.university || '',
      universityEmail: user.universityEmail || '',
      department: user.department || '',
      studentId: user.studentId || '',
      verificationStatus: user.verificationStatus || 'pending',
      verifiedStudent: Boolean(user.verifiedStudent || user.verificationStatus === 'verified'),
      verificationDocs: user.verificationDocs || { idImage: '', selfieImage: '', requestedAt: null },
      verificationHistory: user.verificationHistory || [],
    });
  }
  const user = findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
    location: user.location,
    avatarUrl: user.avatarUrl,
    description: user.description,
    skills: user.skills || [],
    portfolio: user.portfolio || [],
    university: user.university || '',
    universityEmail: user.universityEmail || '',
    department: user.department || '',
    studentId: user.studentId || '',
    verificationStatus: user.verificationStatus || 'pending',
    verifiedStudent: Boolean(user.verifiedStudent || user.verificationStatus === 'verified'),
    verificationDocs: user.verificationDocs || { idImage: '', selfieImage: '', requestedAt: null },
    verificationHistory: user.verificationHistory || [],
  });
});

// Update current user profile
router.put('/me', requireAuth, async (req, res) => {
  const {
    name,
    title,
    location,
    avatarUrl,
    portfolio,
    role,
    description,
    skills,
    university,
    universityEmail,
    department,
    studentId,
    verificationDocs,
  } = req.body;
  if (req.app.locals.dbReady === true) {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (name) user.name = name;
    if (title !== undefined) user.title = title;
    if (location !== undefined) user.location = location;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    if (description !== undefined) user.description = description;
    if (skills !== undefined) user.skills = skills;
    if (portfolio !== undefined) user.portfolio = portfolio;
    if (role === 'buyer' || role === 'seller') user.role = role;
    if (university !== undefined) user.university = university;
    if (universityEmail !== undefined) {
      const previousEmail = user.universityEmail || '';
      user.universityEmail = universityEmail;
      if ((universityEmail || '') !== previousEmail) {
        user.verificationStatus = 'pending';
        user.verifiedStudent = false;
      }
    }
    if (department !== undefined) user.department = department;
    if (studentId !== undefined) user.studentId = studentId;
    if (verificationDocs !== undefined) user.verificationDocs = verificationDocs;
    if (req.body.verificationHistory !== undefined) user.verificationHistory = req.body.verificationHistory;
    await user.save();
    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title,
      location: user.location,
      avatarUrl: user.avatarUrl,
      description: user.description,
      skills: user.skills || [],
      portfolio: user.portfolio || [],
      university: user.university || '',
      universityEmail: user.universityEmail || '',
      department: user.department || '',
      studentId: user.studentId || '',
      verificationStatus: user.verificationStatus || 'pending',
      verifiedStudent: Boolean(user.verifiedStudent || user.verificationStatus === 'verified'),
      verificationDocs: user.verificationDocs || { idImage: '', selfieImage: '', requestedAt: null },
      verificationHistory: user.verificationHistory || [],
    });
  }
  const user = updateUser(req.user.id, {
    ...(name ? { name } : {}),
    ...(title !== undefined ? { title } : {}),
    ...(location !== undefined ? { location } : {}),
    ...(avatarUrl !== undefined ? { avatarUrl } : {}),
    ...(description !== undefined ? { description } : {}),
    ...(skills !== undefined ? { skills } : {}),
    ...(portfolio !== undefined ? { portfolio } : {}),
    ...(role === 'buyer' || role === 'seller' ? { role } : {}),
    ...(university !== undefined ? { university } : {}),
    ...(universityEmail !== undefined ? { universityEmail } : {}),
    ...(department !== undefined ? { department } : {}),
    ...(studentId !== undefined ? { studentId } : {}),
    ...(verificationDocs !== undefined ? { verificationDocs } : {}),
    ...(req.body.verificationHistory !== undefined ? { verificationHistory: req.body.verificationHistory } : {}),
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
    location: user.location,
    avatarUrl: user.avatarUrl,
    description: user.description,
    skills: user.skills || [],
    portfolio: user.portfolio || [],
    university: user.university || '',
    universityEmail: user.universityEmail || '',
    department: user.department || '',
    studentId: user.studentId || '',
    verificationStatus: user.verificationStatus || 'pending',
    verifiedStudent: Boolean(user.verifiedStudent || user.verificationStatus === 'verified'),
    verificationDocs: user.verificationDocs || { idImage: '', selfieImage: '', requestedAt: null },
    verificationHistory: user.verificationHistory || [],
  });
});

router.post('/verify-request', requireAuth, async (req, res) => {
  const { idImage, selfieImage } = req.body;
  if (!idImage || !selfieImage) {
    return res.status(400).json({ error: 'University ID and selfie are required.' });
  }
  if (req.app.locals.dbReady === true) {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.verificationDocs = {
      idImage,
      selfieImage,
      requestedAt: new Date(),
    };
    user.verificationStatus = 'pending';
    user.verifiedStudent = false;
    await user.save();
    return res.json({ ok: true, verificationStatus: user.verificationStatus });
  }
  const user = updateUser(req.user.id, {
    verificationDocs: {
      idImage,
      selfieImage,
      requestedAt: new Date().toISOString(),
    },
    verificationStatus: 'pending',
    verifiedStudent: false,
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({ ok: true, verificationStatus: user.verificationStatus });
});

// Public seller profile + gigs
router.get('/:id/public', async (req, res) => {
  if (req.app.locals.dbReady === true && !isObjectId(req.params.id)) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (req.app.locals.dbReady === true) {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const gigs = await Gig.find({ freelancerId: user._id }).sort({ createdAt: -1 });
    return res.json({
      seller: {
        id: user._id,
        name: user.name,
        title: user.title,
        location: user.location,
        avatarUrl: user.avatarUrl,
        description: user.description,
        skills: user.skills || [],
        portfolio: user.portfolio || [],
        role: user.role,
        university: user.university || '',
        universityEmail: user.universityEmail || '',
        department: user.department || '',
        studentId: user.studentId || '',
    verificationStatus: user.verificationStatus || 'pending',
    verifiedStudent: Boolean(user.verifiedStudent || user.verificationStatus === 'verified'),
    verificationHistory: user.verificationHistory || [],
  },
      gigs,
    });
  }
  const user = findUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const gigs = listGigs({}).filter((gig) => gig.freelancerId === user.id);
  return res.json({
    seller: {
      id: user.id,
      name: user.name,
      title: user.title,
      location: user.location,
      avatarUrl: user.avatarUrl,
      description: user.description,
      skills: user.skills || [],
      portfolio: user.portfolio || [],
      role: user.role,
      university: user.university || '',
      universityEmail: user.universityEmail || '',
      department: user.department || '',
      studentId: user.studentId || '',
    verificationStatus: user.verificationStatus || 'pending',
    verifiedStudent: Boolean(user.verifiedStudent || user.verificationStatus === 'verified'),
    verificationHistory: user.verificationHistory || [],
  },
    gigs,
  });
});

export default router;
