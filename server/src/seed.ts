import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from './models/Project.js';
import Message from './models/Message.js';
import SiteConfig from './models/SiteConfig.js';

dotenv.config({ path: '../.env' });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB Connected');

    // Clear existing data
    await Project.deleteMany({});
    await Message.deleteMany({});
    await SiteConfig.deleteMany({});

    // Seed Projects
    const projects = await Project.insertMany([
      {
        title: "Kataware Doki Weather",
        description: "Günün saatine göre arayüzü değişen, alacakaranlıkta özel renk paletine geçen atmosferik hava durumu uygulaması.",
        tags: ["React", "OpenWeather", "Tailwind"],
        link: "#",
        image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1000&auto=format&fit=crop"
      },
      {
        title: "Itomori Arşivi",
        description: "Kaybolan anıları saklamak için tasarlanmış, IPFS tabanlı merkeziyetsiz ve şifreli dijital günlük.",
        tags: ["Next.js", "Solidity", "IPFS"],
        link: "#",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop"
      },
      {
        title: "Tiamat Yörüngesi",
        description: "Gök cisimlerinin hareketlerini gerçek zamanlı izleyen, Three.js ile geliştirilmiş 3D görselleştirme.",
        tags: ["Three.js", "WebGL", "Fiber"],
        link: "#",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop"
      },
      {
        title: "Musubi Chat",
        description: "Gerçek zamanlı çeviri özelliği ile dil bariyerlerini aşan, minimalist mesajlaşma platformu.",
        tags: ["Socket.io", "Node.js", "Redis"],
        link: "#",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"
      },
      {
        title: "Nebula Finance",
        description: "Yapay zeka destekli portföy yönetimi ve DeFi analiz paneli.",
        tags: ["D3.js", "Python", "FastAPI"],
        link: "#",
        image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000&auto=format&fit=crop"
      }
    ]);
    console.log(`${projects.length} proje eklendi`);

    // Seed Messages
    const messages = await Message.insertMany([
      { name: "Ahmet Yılmaz", email: "ahmet@example.com", message: "Merhaba, projeniz hakkında görüşmek istiyorum.", isRead: false },
      { name: "Ayşe Demir", email: "ayse@company.com", message: "Freelance iş alıyor musunuz?", isRead: true },
      { name: "Mehmet Kaya", email: "mehmet@tech.com", message: "İş birliği teklifi.", isRead: true }
    ]);
    console.log(`${messages.length} mesaj eklendi`);

    // Seed Config
    await SiteConfig.create({
      hero: {
        title: "Zaman, Mekan ve Mavinin Dansı",
        subtitle: "Gökyüzü ile okyanusun buluştuğu ufuk çizgisinde, pikselleri ve veriyi birbirine bağlayarak zamanın akışında iz bırakan dijital deneyimler tasarlıyorum.",
        ctaText: "Çalışmalarımı Keşfet"
      },
      about: {
        title: "Bir geliştirici, bir tasarımcı ve mavi derinliklerin kaşifi.",
        description: "Kod yazmak, benim için sadece ekrana karakterler dizmek değil; boşlukta süzülen fikirleri yakalayıp onları somut bir gerçekliğe dönüştürme sanatıdır. Dijital evrenin sonsuzluğunda, kullanıcı ile teknoloji arasındaki mesafeyi kapatan köprüler kuruyorum."
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
        description: "Musubi Portfolio - Modern web teknolojileri, yaratıcı tasarım ve derin mavi estetik ile oluşturulmuş kişisel portfolyo.",
        keywords: "react, developer, portfolio, web design, creative"
      }
    });
    console.log('Site config eklendi');

    console.log('Seed tamamlandı!');
    process.exit(0);
  } catch (error) {
    console.error('Seed hatası:', error);
    process.exit(1);
  }
};

seedData();
