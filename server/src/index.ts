import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { connectDB } from './config/db';
import { configureCloudinary } from './config/cloudinary';
import thumbnailRoutes from './routes/thumbnails';

const app = express();
const isProd = process.env.NODE_ENV === 'production';

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(clerkMiddleware());

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
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// Local dev only
if (!isProd) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
