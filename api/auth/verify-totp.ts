import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import * as OTPAuth from 'otpauth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;

    if (!code || code.length !== 6) {
      return res.status(400).json({ error: 'Geçersiz kod formatı' });
    }

    const totp = new OTPAuth.TOTP({
      issuer: 'Musubi',
      label: 'Admin',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: process.env.TOTP_SECRET!
    });

    const delta = totp.validate({ token: code, window: 1 });

    if (delta === null) {
      return res.status(401).json({ error: 'Geçersiz kod' });
    }

    const token = jwt.sign(
      { userId: 'admin', role: 'admin' },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({ token, message: 'Giriş başarılı' });
  } catch (error) {
    console.error('TOTP verification error:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
}
