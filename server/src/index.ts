import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { clerkMiddleware, getAuth } from '@clerk/express';
import { connectDB } from './config/db';
import { configureCloudinary } from './config/cloudinary';
import thumbnailRoutes from './routes/thumbnails';
import communityRoutes from './routes/community';

const app = express();
const isProd = process.env.NODE_ENV === 'production';

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
}));

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

app.use('/api/thumbnails', thumbnailRoutes);
app.use('/api/community', communityRoutes);
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// Debug: check if Clerk token is being received and verified
app.get('/api/auth/debug', (req: Request, res: Response) => {
  const auth = getAuth(req);
  res.json({ userId: auth.userId, sessionId: auth.sessionId });
});

// Global error handler — ensures auth errors also return { message }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status ?? err.statusCode ?? 500;
  console.error(`[error] ${status}:`, err.message ?? err);
  res.status(status).json({ message: err.message || 'Server error' });
});

// Local dev only
if (!isProd) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
