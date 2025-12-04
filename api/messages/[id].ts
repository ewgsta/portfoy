import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/db';
import { Message } from '../_lib/models';
import { verifyAuth } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();
  const { id } = req.query;

  if (!verifyAuth(req)) {
    return res.status(401).json({ error: 'Yetkilendirme gerekli' });
  }

  if (req.method === 'DELETE') {
    try {
      const message = await Message.findByIdAndDelete(id);
      if (!message) return res.status(404).json({ error: 'Mesaj bulunamadı' });
      return res.json({ message: 'Mesaj silindi' });
    } catch (error) {
      return res.status(500).json({ error: 'Mesaj silinemedi' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
