import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/db';
import { Message } from '../_lib/models';
import { verifyAuth } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();

  if (req.method === 'GET') {
    if (!verifyAuth(req)) {
      return res.status(401).json({ error: 'Yetkilendirme gerekli' });
    }
    try {
      const messages = await Message.find().sort({ createdAt: -1 });
      return res.json(messages);
    } catch (error) {
      return res.status(500).json({ error: 'Mesajlar alınamadı' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Tüm alanlar gerekli' });
      }
      const newMessage = new Message({ name, email, message });
      await newMessage.save();
      return res.status(201).json({ message: 'Mesajınız gönderildi' });
    } catch (error) {
      return res.status(400).json({ error: 'Mesaj gönderilemedi' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
