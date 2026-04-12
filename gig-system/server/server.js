import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import morgan from 'morgan';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import Conversation from './models/Conversation.js';
import User from './models/User.js';
import gigsRouter from './routes/gigs.js';
import searchRouter from './routes/search.js';
import aiRouter from './routes/ai.js';
import authRouter from './routes/auth.js';
import ordersRouter from './routes/orders.js';
import chatsRouter from './routes/chats.js';
import paymentsRouter from './routes/payments.js';
import usersRouter from './routes/users.js';
import stripeRouter from './routes/stripe.js';
import adminRouter from './routes/admin.js';
import metaRouter from './routes/meta.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
app.locals.dbReady = false;

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET missing. Using dev default.');
}
if (!process.env.MONGO_URI) {
  console.warn('MONGO_URI missing. Server will run in dev-store mode.');
}
const httpServer = http.createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: '*',
  },
});

// Core middleware
app.use(cors({ origin: '*', credentials: false }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, app: 'gig-system' });
});

// Feature routes
app.use('/api/gigs', gigsRouter);
app.use('/api/search', searchRouter);
app.use('/api/ai', aiRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/chats', chatsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/admin', adminRouter);
app.use('/api/meta', metaRouter);

async function start() {
  httpServer.listen(PORT, () => {
    console.log(`UniHire API running on http://localhost:${PORT}`);
  });

  io.on('connection', (socket) => {
    socket.on('join', ({ conversationId }) => {
      if (conversationId) {
        socket.join(conversationId);
      }
    });

    socket.on('message', async ({ conversationId, text, senderId }) => {
      if (!conversationId || !text || !senderId || mongoose.connection.readyState !== 1) return;
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;
      conversation.messages.push({ senderId, text });
      await conversation.save();
      const latest = conversation.messages[conversation.messages.length - 1];
      io.to(conversationId).emit('message', { conversationId, message: latest });
    });
  });

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });
    app.locals.dbReady = true;
    console.log('MongoDB connected');

    const adminEmail = process.env.ADMIN_EMAIL || 'manalk14322@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Manal1212%%';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: 'Manal Khan',
        email: adminEmail,
        passwordHash,
        role: 'admin',
        verificationStatus: 'verified',
        verifiedStudent: false,
      });
      console.log(`Admin user created for ${adminEmail}. Update ADMIN_EMAIL/ADMIN_PASSWORD in .env for production.`);
    }
  } catch (error) {
    app.locals.dbReady = false;
    console.warn('MongoDB unavailable, using local dev store fallback.');
    console.warn(error?.message || error);
  }
}

start();
