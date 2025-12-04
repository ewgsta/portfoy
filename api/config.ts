import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from './_lib/db';
import { SiteConfig } from './_lib/models';
import { verifyAuth } from './_lib/auth';

const DEFAULT_CONFIG = {
  hero: {
    title: "Zaman, Mekan ve Mavinin Dansı",
    subtitle: "Gökyüzü ile okyanusun buluştuğu ufuk çizgisinde, pikselleri ve veriyi birbirine bağlayarak zamanın akışında iz bırakan dijital deneyimler tasarlıyorum.",
    ctaText: "Çalışmalarımı Keşfet"
  },
  about: {
    title: "Bir geliştirici, bir tasarımcı ve mavi derinliklerin kaşifi.",
    description: "Kod yazmak, benim için sadece ekrana karakterler dizmek değil; boşlukta süzülen fikirleri yakalayıp onları somut bir gerçekliğe dönüştürme sanatıdır."
  },
  projectsSection: {
    title: "Seçili Projeler",
    subtitle: "Zamanın ötesine geçen kod parçaları.",
    githubButtonText: "Daha fazlası için GitHub"
  },
  contact: {
    title: "Bağlantı Kur",
    subtitle: "Dijital dünyada iz bırakmak için bir mesaj uzağındayım.",
    formTitle: "Mesaj Gönder",
    emailPlaceholder: "E-posta Adresiniz",
    messagePlaceholder: "Projenizden bahsedin...",
    buttonText: "Gönder",
    infoEmail: "contact@musubi.dev",
    infoPhone: "+90 555 000 00 00",
    infoAddress: "İstanbul, Türkiye",
    footerText: "© 2024 Musubi. Mavi derinliklerde kodlandı."
  },
  seo: {
    title: "Musubi Portfolio | Dijital Sanat & Kod",
    description: "Musubi Portfolio - Modern web teknolojileri ile oluşturulmuş kişisel portfolyo.",
    keywords: "react, developer, portfolio, web design"
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      let config = await SiteConfig.findOne();
      if (!config) {
        config = await SiteConfig.create(DEFAULT_CONFIG);
      }
      return res.json(config);
    }

    if (req.method === 'PUT') {
      if (!verifyAuth(req)) {
        return res.status(401).json({ error: 'Yetkilendirme gerekli' });
      }
      let config = await SiteConfig.findOne();
      if (config) {
        config = await SiteConfig.findByIdAndUpdate(config._id, req.body, { new: true });
      } else {
        config = await SiteConfig.create(req.body);
      }
      return res.json(config);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Config error:', error);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
}
