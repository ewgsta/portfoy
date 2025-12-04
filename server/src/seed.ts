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
        title: "deneme",
        description: "deneme.",
        tags: ["React", "OpenWeather", "Tailwind"],
        link: "#",
        image: "görsel"
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
        infoEmail: "hi@ewgsta.me",
        infoPhone: "+90 555 000 00 00",
        infoAddress: "Amasya, Türkiye",
        footerText: "© 2025 ewgsta. Mavi derinliklerde kodlandı."
      },
      seo: {
        title: "ewgsta Portfolio | Dijital Sanat & Kod",
        description: "ewgsta Portfolio - Modern web teknolojileri, yaratıcı tasarım ve derin mavi estetik ile oluşturulmuş kişisel portfolyo.",
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
