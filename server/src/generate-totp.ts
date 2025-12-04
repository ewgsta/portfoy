import * as OTPAuth from 'otpauth';

// Yeni TOTP secret oluştur
const secret = new OTPAuth.Secret({ size: 20 });

const totp = new OTPAuth.TOTP({
  issuer: 'Musubi',
  label: 'Admin',
  algorithm: 'SHA1',
  digits: 6,
  period: 30,
  secret: secret
});

console.log('=== TOTP Kurulum Bilgileri ===\n');
console.log('Secret (Base32):', secret.base32);
console.log('\n.env dosyasına ekleyin:');
console.log(`TOTP_SECRET=${secret.base32}`);
console.log('\nGoogle Authenticator QR URL:');
console.log(totp.toString());
console.log('\nTest kodu (şu an geçerli):', totp.generate());
