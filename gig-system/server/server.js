import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import Conversation from './models/Conversation.js';
import gigsRouter from './routes/gigs.js';
import searchRouter from './routes/search.js';
import aiRouter from './routes/ai.js';
import authRouter from './routes/auth.js';
import ordersRouter from './routes/orders.js';
import chatsRouter from './routes/chats.js';
import paymentsRouter from './routes/payments.js';
import usersRouter from './routes/users.js';
import stripeRouter from './routes/stripe.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
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

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
    });
    io.on('connection', (socket) => {
      socket.on('join', ({ conversationId }) => {
        if (conversationId) {
          socket.join(conversationId);
        }
      });

      socket.on('message', async ({ conversationId, text, senderId }) => {
        if (!conversationId || !text || !senderId) return;
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;
        conversation.messages.push({ senderId, text });
        await conversation.save();
        const latest = conversation.messages[conversation.messages.length - 1];
        io.to(conversationId).emit('message', { conversationId, message: latest });
      });
    });

    httpServer.listen(PORT, () => {
      console.log(`UniHire API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

start();
