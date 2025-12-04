
import React, { useState, useEffect } from 'react';
import StarryBackground from './components/StarryBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import LoginModal from './components/LoginModal';
import AdminPanel from './components/AdminPanel';
import { Project, SiteConfig, ContactMessage } from './types';

// Initial Mock Data
const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Kataware Doki Weather",
    description: "Günün saatine göre arayüzü değişen, alacakaranlıkta özel renk paletine geçen atmosferik hava durumu uygulaması.",
    tags: ["React", "OpenWeather", "Tailwind"],
    link: "#",
    image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Itomori Arşivi",
    description: "Kaybolan anıları saklamak için tasarlanmış, IPFS tabanlı merkeziyetsiz ve şifreli dijital günlük.",
    tags: ["Next.js", "Solidity", "IPFS"],
    link: "#",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Tiamat Yörüngesi",
    description: "Gök cisimlerinin hareketlerini gerçek zamanlı izleyen, Three.js ile geliştirilmiş 3D görselleştirme.",
    tags: ["Three.js", "WebGL", "Fiber"],
    link: "#",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Musubi Chat",
    description: "Gerçek zamanlı çeviri özelliği ile dil bariyerlerini aşan, minimalist mesajlaşma platformu.",
    tags: ["Socket.io", "Node.js", "Redis"],
    link: "#",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Nebula Finance",
    description: "Yapay zeka destekli portföy yönetimi ve DeFi analiz paneli.",
    tags: ["D3.js", "Python", "FastAPI"],
    link: "#",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000&auto=format&fit=crop"
  }
];

const INITIAL_CONFIG: SiteConfig = {
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
};

const INITIAL_MESSAGES: ContactMessage[] = [
  { id: 1, name: "Ahmet Yılmaz", email: "ahmet@example.com", message: "Merhaba, projeniz hakkında görüşmek istiyorum.", date: "2024-03-10", isRead: false },
  { id: 2, name: "Ayşe Demir", email: "ayse@company.com", message: "Freelance iş alıyor musunuz?", date: "2024-03-08", isRead: true },
  { id: 3, name: "Mehmet Kaya", email: "mehmet@tech.com", message: "İş birliği teklifi.", date: "2024-03-07", isRead: true },
  { id: 4, name: "Elif Şahin", email: "elif@design.com", message: "Tasarım sisteminiz harika.", date: "2024-03-05", isRead: true },
  { id: 5, name: "Can Yıldız", email: "can@startup.io", message: "Yatırım görüşmesi.", date: "2024-03-01", isRead: true },
  { id: 6, name: "Zeynep", email: "zeynep@blog.com", message: "Röportaj yapabilir miyiz?", date: "2024-02-28", isRead: true },
];

function App() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(INITIAL_CONFIG);
  const [messages, setMessages] = useState<ContactMessage[]>(INITIAL_MESSAGES);
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // SEO Effect
  useEffect(() => {
    document.title = siteConfig.seo.title;
    
    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', siteConfig.seo.description);
  }, [siteConfig.seo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        if (isAuthenticated) {
          setIsAdminView(true);
        } else {
          setIsLoginOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsLoginOpen(false);
    setIsAdminView(true);
  };

  if (isAdminView) {
    return (
      <AdminPanel 
        projects={projects} 
        siteConfig={siteConfig}
        messages={messages}
        onUpdateProjects={setProjects} 
        onUpdateConfig={setSiteConfig}
        onUpdateMessages={setMessages}
        onExit={() => setIsAdminView(false)} 
      />
    );
  }

  return (
    <div className="relative min-h-screen">
      <StarryBackground />
      <Navbar />
      
      <main className="flex flex-col">
        <Hero config={siteConfig.hero} />
        <About config={siteConfig.about} />
        <Projects projects={projects} config={siteConfig.projectsSection} />
        <Contact config={siteConfig.contact} />
      </main>

      {isLoginOpen && (
        <LoginModal 
          onSuccess={handleLoginSuccess} 
          onClose={() => setIsLoginOpen(false)} 
        />
      )}
    </div>
  );
}

export default App;
