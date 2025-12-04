import { Router } from 'express';
import SiteConfig from '../models/SiteConfig.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Site config getir (public)
router.get('/', async (req, res) => {
  try {
    let config = await SiteConfig.findOne();
    
    if (!config) {
      // Default config oluştur
      config = await SiteConfig.create({
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
      });
    }
    
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Config alınamadı' });
  }
});

// Site config güncelle (protected)
router.put('/', authMiddleware, async (req, res) => {
  try {
    let config = await SiteConfig.findOne();
    
    if (config) {
      config = await SiteConfig.findByIdAndUpdate(config._id, req.body, { new: true });
    } else {
      config = await SiteConfig.create(req.body);
    }
    
    res.json(config);
  } catch (error) {
    res.status(400).json({ error: 'Config güncellenemedi' });
  }
});

export default router;
