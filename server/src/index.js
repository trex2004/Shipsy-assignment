import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import todoRoutes from './routes/todo.js';

dotenv.config({ path: './.env' });

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  credentials: true,
}));

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'shipsy-todo-api' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// MongoDB
const mongoUri = process.env.MONGODB_URI;


async function start() {
    try {
    await mongoose.connect(mongoUri, { 
      serverSelectionTimeoutMS: 10000,
    });
    const port = process.env.PORT || 4000;
    app.listen(port, () => console.log(`API listening on :${port}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();


