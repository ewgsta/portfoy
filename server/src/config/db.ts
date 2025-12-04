import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('HATA: MONGODB_URI çevre değişkeni (.env) tanımlanmamış!');
    process.exit(1);
  }

  mongoose.connection.on('connected', () => {
    console.log('MongoDB bağlantısı aktif.');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB bağlantı hatası:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB bağlantısı koptu!');
  });

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Bağlandı: ${conn.connection.host}`);
  } catch (error) {
    console.error('İlk bağlantı sırasında hata oluştu:', error);
    process.exit(1);
  }
};
