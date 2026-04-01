import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../models/User';
import { AuthToken } from '../models/AuthToken';
import { requireAuth } from '../middleware/auth';

function makeToken() {
  return crypto.randomBytes(32).toString('hex');
}

function tokenExpiry() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d;
}


const router = Router();

// POST /api/auth/signup
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }

    const user = await User.create({ name, email, password });
    const token = makeToken();
    await AuthToken.create({ token, userId: user._id.toString(), expiresAt: tokenExpiry() });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = makeToken();
    await AuthToken.create({ token, userId: user._id.toString(), expiresAt: tokenExpiry() });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    await AuthToken.deleteOne({ token: header.slice(7) });
  }
  req.session.destroy(() => {});
  res.clearCookie('connect.sid');
  res.json({ message: 'Logged out' });
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;
