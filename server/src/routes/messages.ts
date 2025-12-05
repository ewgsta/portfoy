import { Router } from 'express';
import Message from '../models/Message.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Tüm mesajları getir (protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Mesajlar alınamadı' });
  }
});

// Yeni mesaj gönder (public - contact form)
router.post('/', async (req, res) => {
  try {
    const { name, email, message, visitorId } = req.body;
    const ip = req.ip || req.socket.remoteAddress;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Tüm alanlar gerekli' });
    }

    // Rate Limiting: Son 1 saat içinde bu IP veya VisitorID'den mesaj gelmiş mi?
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const existingMessage = await Message.findOne({
      $or: [
        { ip: ip, createdAt: { $gt: oneHourAgo } },
        { visitorId: visitorId, createdAt: { $gt: oneHourAgo } }
      ]
    });

    if (existingMessage) {
      return res.status(429).json({ error: 'Çok fazla mesaj gönderdiniz. Lütfen 1 saat bekleyin.' });
    }

    const newMessage = new Message({ 
      name, 
      email, 
      message,
      ip,
      visitorId
    });
    
    await newMessage.save();
    res.status(201).json({ message: 'Mesajınız gönderildi' });
  } catch (error) {
    res.status(400).json({ error: 'Mesaj gönderilemedi' });
  }
});

// Mesaj okundu işaretle (protected)
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: req.body.isRead },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ error: 'Mesaj bulunamadı' });
    }
    res.json(message);
  } catch (error) {
    res.status(400).json({ error: 'Mesaj güncellenemedi' });
  }
});

// Mesaj sil (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Mesaj bulunamadı' });
    }
    res.json({ message: 'Mesaj silindi' });
  } catch (error) {
    res.status(500).json({ error: 'Mesaj silinemedi' });
  }
});

export default router;
