import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

export function verifyAuth(req: VercelRequest): boolean {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return false;
    jwt.verify(token, process.env.JWT_SECRET!);
    return true;
  } catch {
    return false;
  }
}

export function withAuth(handler: (req: VercelRequest, res: VercelResponse) => Promise<void>) {
  return async (req: VercelRequest, res: VercelResponse) => {
    if (!verifyAuth(req)) {
      return res.status(401).json({ error: 'Yetkilendirme gerekli' });
    }
    return handler(req, res);
  };
}
