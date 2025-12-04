import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from './_lib/db';
import { Message } from './_lib/models';
import { verifyAuth } from './_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      if (!verifyAuth(req)) {
        return res.status(401).json({ error: 'Yetkilendirme gerekli' });
      }
      const messages = await Message.find().sort({ createdAt: -1 });
      return res.json(messages);
    }

    if (req.method === 'POST') {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Tüm alanlar gerekli' });
      }
      const newMessage = new Message({ name, email, message });
      await newMessage.save();
      return res.status(201).json({ message: 'Mesajınız gönderildi' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Messages error:', error);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
}
