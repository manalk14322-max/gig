import jwt from 'jsonwebtoken';
import { publicUser, readDb } from './db.js';

const secret = process.env.JWT_SECRET || 'dev-secret';

export function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '7d' });
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Login required.' });

  try {
    const payload = jwt.verify(token, secret);
    const db = await readDb();
    const user = db.users.find((item) => item.id === payload.id && !item.blocked);
    if (!user) return res.status(401).json({ error: 'Account not found or blocked.' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid session.' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required.' });
  next();
}

export function meResponse(user) {
  return { user: publicUser(user) };
}
