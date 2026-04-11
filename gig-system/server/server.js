import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import gigsRouter from './routes/gigs.js';
import searchRouter from './routes/search.js';
import aiRouter from './routes/ai.js';
import authRouter from './routes/auth.js';
import ordersRouter from './routes/orders.js';
import chatsRouter from './routes/chats.js';
import paymentsRouter from './routes/payments.js';
import usersRouter from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

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

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
    });
    app.listen(PORT, () => {
      console.log(`Gig System API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

start();
