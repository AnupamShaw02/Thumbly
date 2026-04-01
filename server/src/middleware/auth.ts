import { Request, Response, NextFunction } from 'express';
import { AuthToken } from '../models/AuthToken';

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Check Authorization header first (token-based, works cross-origin)
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    const raw = header.slice(7);
    const record = await AuthToken.findOne({ token: raw, expiresAt: { $gt: new Date() } });
    if (record) {
      req.session.userId = record.userId;
      next();
      return;
    }
  }
  // Fallback to session cookie
  if (req.session.userId) {
    next();
    return;
  }
  res.status(401).json({ message: 'Not authenticated' });
};
