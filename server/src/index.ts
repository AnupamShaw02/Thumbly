import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { connectDB } from './config/db';
import { configureCloudinary } from './config/cloudinary';
import authRoutes from './routes/auth';
import thumbnailRoutes from './routes/thumbnails';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// CORS must be first — before anything that can error
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Lazy DB connection for serverless
let isReady = false;
app.use(async (_req, _res, next) => {
  if (!isReady) {
    await connectDB();
    configureCloudinary();
    isReady = true;
  }
  next();
});

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


app.use('/api/auth', authRoutes);
app.use('/api/thumbnails', thumbnailRoutes);
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// Local dev only
if (!isProd) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
