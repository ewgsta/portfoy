import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from './_lib/db';
import { Project } from './_lib/models';
import { verifyAuth } from './_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      const projects = await Project.find().sort({ createdAt: -1 });
      return res.json(projects);
    }

    if (req.method === 'POST') {
      if (!verifyAuth(req)) {
        return res.status(401).json({ error: 'Yetkilendirme gerekli' });
      }
      const project = new Project(req.body);
      await project.save();
      return res.status(201).json(project);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Projects error:', error);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
}
