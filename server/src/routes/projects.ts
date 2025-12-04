import { Router } from 'express';
import Project from '../models/Project.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Tüm projeleri getir (public)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Projeler alınamadı' });
  }
});

// Yeni proje ekle (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: 'Proje oluşturulamadı' });
  }
});

// Proje güncelle (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ error: 'Proje bulunamadı' });
    }
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: 'Proje güncellenemedi' });
  }
});

// Proje sil (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Proje bulunamadı' });
    }
    res.json({ message: 'Proje silindi' });
  } catch (error) {
    res.status(500).json({ error: 'Proje silinemedi' });
  }
});

export default router;
