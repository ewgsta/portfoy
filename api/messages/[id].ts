import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/db';
import { Message } from '../_lib/models';
import { verifyAuth } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();
    const { id } = req.query;

    if (!verifyAuth(req)) {
      return res.status(401).json({ error: 'Yetkilendirme gerekli' });
    }

    if (req.method === 'DELETE') {
      const message = await Message.findByIdAndDelete(id);
      if (!message) return res.status(404).json({ error: 'Mesaj bulunamadı' });
      return res.json({ message: 'Mesaj silindi' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Message error:', error);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
}
