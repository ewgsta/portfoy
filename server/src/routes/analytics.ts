import { Router } from 'express';
import Analytics from '../models/Analytics.js';
import Message from '../models/Message.js';
import Project from '../models/Project.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Sayfa görüntüleme kaydet (public)
router.post('/pageview', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await Analytics.findOneAndUpdate(
      { date: today },
      { $inc: { pageViews: 1 } },
      { upsert: true, new: true }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Kayıt başarısız' });
  }
});

// Proje tıklaması kaydet (public)
router.post('/project-click', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await Analytics.findOneAndUpdate(
      { date: today },
      { $inc: { projectClicks: 1 } },
      { upsert: true, new: true }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Kayıt başarısız' });
  }
});

// Dashboard istatistikleri (protected)
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Son 30 günlük veriler
    const analyticsData = await Analytics.find({
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: 1 });
    
    // Toplam istatistikler
    const totalStats = analyticsData.reduce((acc, day) => ({
      pageViews: acc.pageViews + day.pageViews,
      projectClicks: acc.projectClicks + day.projectClicks,
      uniqueVisitors: acc.uniqueVisitors + day.uniqueVisitors
    }), { pageViews: 0, projectClicks: 0, uniqueVisitors: 0 });
    
    // Son 7 gün vs önceki 7 gün karşılaştırması
    const last7Days = analyticsData.filter(d => d.date >= sevenDaysAgo);
    const prev7Days = analyticsData.filter(d => d.date < sevenDaysAgo && d.date >= new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000));
    
    const last7Total = last7Days.reduce((acc, d) => acc + d.pageViews, 0);
    const prev7Total = prev7Days.reduce((acc, d) => acc + d.pageViews, 0);
    const viewsChange = prev7Total > 0 ? ((last7Total - prev7Total) / prev7Total * 100).toFixed(1) : '0';
    
    const last7Clicks = last7Days.reduce((acc, d) => acc + d.projectClicks, 0);
    const prev7Clicks = prev7Days.reduce((acc, d) => acc + d.projectClicks, 0);
    const clicksChange = prev7Clicks > 0 ? ((last7Clicks - prev7Clicks) / prev7Clicks * 100).toFixed(1) : '0';
    
    // Mesaj sayıları
    const unreadMessages = await Message.countDocuments({ isRead: false });
    const totalMessages = await Message.countDocuments();
    
    // Proje sayısı
    const totalProjects = await Project.countDocuments();
    
    // Grafik verileri (son 7 gün)
    const chartLabels: string[] = [];
    const chartPageViews: number[] = [];
    const chartClicks: number[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayData = analyticsData.find(d => 
        d.date.toISOString().split('T')[0] === date.toISOString().split('T')[0]
      );
      
      chartLabels.push(date.toLocaleDateString('tr-TR', { weekday: 'short' }));
      chartPageViews.push(dayData?.pageViews || 0);
      chartClicks.push(dayData?.projectClicks || 0);
    }
    
    res.json({
      totals: {
        pageViews: totalStats.pageViews,
        projectClicks: totalStats.projectClicks,
        unreadMessages,
        totalMessages,
        totalProjects
      },
      changes: {
        viewsChange: parseFloat(viewsChange as string),
        clicksChange: parseFloat(clicksChange as string)
      },
      chart: {
        labels: chartLabels,
        pageViews: chartPageViews,
        projectClicks: chartClicks
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'İstatistikler alınamadı' });
  }
});

export default router;
