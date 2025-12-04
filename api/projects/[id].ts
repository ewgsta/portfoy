import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/db';
import { Project } from '../_lib/models';
import { verifyAuth } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();
    const { id } = req.query;

    if (!verifyAuth(req)) {
      return res.status(401).json({ error: 'Yetkilendirme gerekli' });
    }

    if (req.method === 'PUT') {
      const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
      if (!project) return res.status(404).json({ error: 'Proje bulunamadı' });
      return res.json(project);
    }

    if (req.method === 'DELETE') {
      const project = await Project.findByIdAndDelete(id);
      if (!project) return res.status(404).json({ error: 'Proje bulunamadı' });
      return res.json({ message: 'Proje silindi' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Project error:', error);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
}
