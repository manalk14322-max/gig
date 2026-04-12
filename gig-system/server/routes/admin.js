import express from 'express';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { getStore, updateUser } from '../lib/devStore.js';

const router = express.Router();

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  return next();
}

router.get('/verification', requireAuth, requireAdmin, async (req, res) => {
  if (req.app.locals.dbReady === true) {
    const users = await User.find({
      verificationStatus: 'pending',
      'verificationDocs.requestedAt': { $ne: null },
    }).select('name email university department verificationDocs verificationStatus');
    return res.json({
      items: users.map((user) => ({
        id: user._id,
      name: user.name,
      email: user.email,
      university: user.university || '',
      department: user.department || '',
      verificationStatus: user.verificationStatus || 'pending',
      verificationDocs: user.verificationDocs || { idImage: '', selfieImage: '', requestedAt: null },
      verificationHistory: user.verificationHistory || [],
    })),
  });
  }

  const store = getStore();
  const items = store.users
    .filter((user) => user.verificationStatus === 'pending' && user.verificationDocs?.requestedAt)
    .map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      university: user.university || '',
      department: user.department || '',
      verificationStatus: user.verificationStatus || 'pending',
      verificationDocs: user.verificationDocs || { idImage: '', selfieImage: '', requestedAt: null },
      verificationHistory: user.verificationHistory || [],
    }));
  return res.json({ items });
});

router.patch('/verification/:id', requireAuth, requireAdmin, async (req, res) => {
  const { status, note } = req.body;
  if (!['verified', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }
  const decisionNote = note || (status === 'verified' ? 'Verification approved.' : 'Verification rejected.');
  const decisionEntry = {
    status,
    note: decisionNote,
    decidedAt: new Date(),
    decidedBy: req.user?.email || 'admin',
  };

  if (req.app.locals.dbReady === true) {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.verificationStatus = status;
    user.verifiedStudent = status === 'verified';
    user.verificationHistory = [...(user.verificationHistory || []), decisionEntry];
    await user.save();
    return res.json({
      ok: true,
    user: {
      id: user._id,
      name: user.name,
      verificationStatus: user.verificationStatus,
      verifiedStudent: user.verifiedStudent,
    },
  });
  }

  const updated = updateUser(req.params.id, {
    verificationStatus: status,
    verifiedStudent: status === 'verified',
    verificationHistory: [
      ...((getStore().users.find((entry) => entry.id === req.params.id)?.verificationHistory || [])),
      {
        status,
        note: decisionNote,
        decidedAt: new Date().toISOString(),
        decidedBy: req.user?.email || 'admin',
      },
    ],
  });
  if (!updated) return res.status(404).json({ error: 'User not found' });
  return res.json({
    ok: true,
    user: {
      id: updated.id,
      name: updated.name,
      verificationStatus: updated.verificationStatus,
      verifiedStudent: updated.verifiedStudent,
    },
  });
});

export default router;
