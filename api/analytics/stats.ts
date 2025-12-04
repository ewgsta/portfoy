import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/db';
import { Analytics, Message, Project } from '../_lib/models';
import { verifyAuth } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!verifyAuth(req)) {
    return res.status(401).json({ error: 'Yetkilendirme gerekli' });
  }

  try {
    await connectDB();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const analyticsData = await Analytics.find({
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: 1 });
    
    const totalStats = analyticsData.reduce((acc, day) => ({
      pageViews: acc.pageViews + day.pageViews,
      projectClicks: acc.projectClicks + day.projectClicks,
      uniqueVisitors: acc.uniqueVisitors + day.uniqueVisitors
    }), { pageViews: 0, projectClicks: 0, uniqueVisitors: 0 });
    
    const last7Days = analyticsData.filter(d => d.date >= sevenDaysAgo);
    const prev7Days = analyticsData.filter(d => d.date < sevenDaysAgo && d.date >= new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000));
    
    const last7Total = last7Days.reduce((acc, d) => acc + d.pageViews, 0);
    const prev7Total = prev7Days.reduce((acc, d) => acc + d.pageViews, 0);
    const viewsChange = prev7Total > 0 ? ((last7Total - prev7Total) / prev7Total * 100).toFixed(1) : '0';
    
    const last7Clicks = last7Days.reduce((acc, d) => acc + d.projectClicks, 0);
    const prev7Clicks = prev7Days.reduce((acc, d) => acc + d.projectClicks, 0);
    const clicksChange = prev7Clicks > 0 ? ((last7Clicks - prev7Clicks) / prev7Clicks * 100).toFixed(1) : '0';
    
    const unreadMessages = await Message.countDocuments({ isRead: false });
    const totalMessages = await Message.countDocuments();
    const totalProjects = await Project.countDocuments();
    
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
    
    return res.json({
      totals: { pageViews: totalStats.pageViews, projectClicks: totalStats.projectClicks, unreadMessages, totalMessages, totalProjects },
      changes: { viewsChange: parseFloat(viewsChange as string), clicksChange: parseFloat(clicksChange as string) },
      chart: { labels: chartLabels, pageViews: chartPageViews, projectClicks: chartClicks }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({ error: 'İstatistikler alınamadı' });
  }
}
