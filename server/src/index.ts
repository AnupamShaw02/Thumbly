import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { connectDB } from './config/db';
import { configureCloudinary } from './config/cloudinary';
import authRoutes from './routes/auth';
import thumbnailRoutes from './routes/thumbnails';

// Extend session type
declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI!,
    ttl: 7 * 24 * 60 * 60,
  }),
  cookie: {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/thumbnails', thumbnailRoutes);

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// For Vercel serverless
const start = async () => {
  try {
    await connectDB();
    configureCloudinary();
    if (!isProd) {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
}
};

start();

export default app;
