import { Router, Request, Response } from 'express';
import axios from 'axios';
import { getAuth } from '@clerk/express';
import { cloudinary } from '../config/cloudinary';
import { Thumbnail } from '../models/Thumbnail';
import { requireAuth } from '../middleware/auth';

const router = Router();

// All thumbnail routes require auth
router.use(requireAuth());

// POST /api/thumbnails/generate
router.post('/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = getAuth(req) as { userId: string };
    const { title, style, aspectRatio, colorScheme, additionalDetails } = req.body;

    if (!title) {
      res.status(400).json({ message: 'Title is required' });
      return;
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      res.status(500).json({ message: 'Gemini API key not configured' });
      return;
    }

    const imagePrompt = `YouTube thumbnail for "${title}", ${style || 'modern'} style, ${colorScheme || 'vibrant'} color scheme, bold text overlay, high contrast, eye-catching, professional design${additionalDetails ? `, ${additionalDetails}` : ''}`;

    // Call Google Imagen 3 via Gemini API
    const imagenResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${geminiKey}`,
      {
        instances: [{ prompt: imagePrompt }],
        parameters: { sampleCount: 1, aspectRatio: '16:9' },
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000,
      }
    );

    const b64 = imagenResponse.data.predictions[0].bytesBase64Encoded;
    const base64Image = `data:image/png;base64,${b64}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: 'thumbly',
      public_id: `thumb_${userId}_${Date.now()}`,
    });

    // Save to DB
    const thumbnail = await Thumbnail.create({
      userId,
      imageUrl: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
      promptData: {
        title,
        style: style || 'modern',
        aspectRatio: aspectRatio || '16:9',
        colorScheme: colorScheme || 'vibrant',
        additionalDetails: additionalDetails || '',
      },
    });

    res.status(201).json({ thumbnail });
  } catch (err: any) {
    const errData = err?.response?.data;
    const errMsg = typeof errData === 'string' ? errData
      : errData instanceof Buffer ? errData.toString('utf-8')
      : errData ? JSON.stringify(errData) : err.message;
    console.error('Generate error:', errMsg);
    res.status(500).json({ message: err.message || 'Generation failed' });
  }
});

// GET /api/thumbnails — list user's thumbnails
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = getAuth(req) as { userId: string };
    const thumbnails = await Thumbnail.find({ userId, promptData: { $exists: true } }).sort({ createdAt: -1 });
    res.json({ thumbnails });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/thumbnails/:id — get single thumbnail (owner or public)
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = getAuth(req) as { userId: string };
    const thumbnail = await Thumbnail.findOne({
      _id: req.params.id,
      $or: [{ userId }, { isPublic: true }],
    });

    if (!thumbnail) {
      res.status(404).json({ message: 'Thumbnail not found' });
      return;
    }

    res.json({ thumbnail });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/thumbnails/:id
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = getAuth(req) as { userId: string };
    const thumbnail = await Thumbnail.findOne({
      _id: req.params.id,
      userId,
    });

    if (!thumbnail) {
      res.status(404).json({ message: 'Thumbnail not found' });
      return;
    }

    await cloudinary.uploader.destroy(thumbnail.cloudinaryId);
    await thumbnail.deleteOne();
    res.json({ message: 'Thumbnail deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
