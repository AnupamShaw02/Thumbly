import { Router, Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { requireAuth } from '../middleware/auth';
import { Thumbnail } from '../models/Thumbnail';

const router = Router();

// GET /api/community — public feed (no auth required)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { style, sort = 'newest' } = req.query;
    const filter: Record<string, any> = { isPublic: true };
    if (style && style !== 'all') filter['promptData.style'] = style;

    const thumbnails = await Thumbnail.find(filter)
      .sort(sort === 'popular' ? { 'likes': -1, createdAt: -1 } : { createdAt: -1 })
      .limit(50);
    res.json({ thumbnails });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/community/:id/like — toggle like
router.post('/:id/like', requireAuth(), async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = getAuth(req) as { userId: string };
    const thumbnail = await Thumbnail.findOne({ _id: req.params.id, isPublic: true });
    if (!thumbnail) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    const alreadyLiked = thumbnail.likes.includes(userId);
    if (alreadyLiked) {
      thumbnail.likes = thumbnail.likes.filter((id) => id !== userId);
    } else {
      thumbnail.likes.push(userId);
    }
    await thumbnail.save();
    res.json({ likes: thumbnail.likes.length, liked: !alreadyLiked });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/community/:id/visibility — toggle public/private (owner only)
router.patch('/:id/visibility', requireAuth(), async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = getAuth(req) as { userId: string };
    const thumbnail = await Thumbnail.findOne({ _id: req.params.id, userId });
    if (!thumbnail) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    thumbnail.isPublic = !thumbnail.isPublic;
    await thumbnail.save();
    res.json({ isPublic: thumbnail.isPublic });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
