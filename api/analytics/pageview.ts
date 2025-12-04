import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/db';
import { Analytics } from '../_lib/models';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await Analytics.findOneAndUpdate(
      { date: today },
      { $inc: { pageViews: 1 } },
      { upsert: true, new: true }
    );
    
    return res.json({ success: true });
  } catch (error) {
    console.error('Pageview error:', error);
    return res.json({ success: false }); // Silent fail
  }
}
