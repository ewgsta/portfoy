import { Router } from 'express';
import jwt from 'jsonwebtoken';
import * as OTPAuth from 'otpauth';

const router = Router();

// TOTP doğrulama
router.post('/verify-totp', (req, res) => {
  try {
    const { code } = req.body;

    if (!code || code.length !== 6) {
      return res.status(400).json({ error: 'Geçersiz kod formatı' });
    }

    const totp = new OTPAuth.TOTP({
      issuer: 'ewgsta-portfoy',
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
});

// Token doğrulama
router.get('/verify-token', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ valid: false });
    }

    jwt.verify(token, process.env.JWT_SECRET!);
    res.json({ valid: true });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

export default router;
