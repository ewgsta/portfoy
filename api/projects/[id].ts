import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/db';
import { Project } from '../_lib/models';
import { verifyAuth } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();
  const { id } = req.query;

  if (!verifyAuth(req)) {
    return res.status(401).json({ error: 'Yetkilendirme gerekli' });
  }

  if (req.method === 'PUT') {
    try {
      const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
      if (!project) return res.status(404).json({ error: 'Proje bulunamadı' });
      return res.json(project);
    } catch (error) {
      return res.status(400).json({ error: 'Proje güncellenemedi' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const project = await Project.findByIdAndDelete(id);
      if (!project) return res.status(404).json({ error: 'Proje bulunamadı' });
      return res.json({ message: 'Proje silindi' });
    } catch (error) {
      return res.status(500).json({ error: 'Proje silinemedi' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
