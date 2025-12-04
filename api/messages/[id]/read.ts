import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../../_lib/db';
import { Message } from '../../_lib/models';
import { verifyAuth } from '../../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!verifyAuth(req)) {
    return res.status(401).json({ error: 'Yetkilendirme gerekli' });
  }

  await connectDB();
  const { id } = req.query;

  try {
    const message = await Message.findByIdAndUpdate(
      id,
      { isRead: req.body.isRead },
      { new: true }
    );
    if (!message) return res.status(404).json({ error: 'Mesaj bulunamadı' });
    return res.json(message);
  } catch (error) {
    return res.status(400).json({ error: 'Mesaj güncellenemedi' });
  }
}
