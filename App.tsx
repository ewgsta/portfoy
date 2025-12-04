
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
import { api } from './src/api/client';

const DEFAULT_CONFIG: SiteConfig = {
  hero: { title: "", subtitle: "", ctaText: "" },
  about: { title: "", description: "" },
  projectsSection: { title: "", subtitle: "", githubButtonText: "" },
  contact: { title: "", subtitle: "", formTitle: "", emailPlaceholder: "", messagePlaceholder: "", buttonText: "", infoEmail: "", infoPhone: "", infoAddress: "", footerText: "" },
  seo: { title: "", description: "", keywords: "" }
};

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, configData] = await Promise.all([
          api.getProjects(),
          api.getConfig()
        ]);
        setProjects(projectsData.map((p: any) => ({ ...p, id: p._id })));
        setSiteConfig(configData);
        
        // Check if already authenticated
        const token = api.getToken();
        if (token) {
          const valid = await api.verifyToken();
          setIsAuthenticated(valid);
        }
      } catch (error) {
        console.error('Data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // SEO Effect
  useEffect(() => {
    if (siteConfig.seo.title) {
      document.title = siteConfig.seo.title;
      
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', siteConfig.seo.description);
    }
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

  const handleLoginSuccess = async () => {
    setIsAuthenticated(true);
    setIsLoginOpen(false);
    // Fetch messages for admin
    try {
      const messagesData = await api.getMessages();
      setMessages(messagesData.map((m: any) => ({ 
        ...m, 
        id: m._id, 
        date: new Date(m.createdAt).toISOString().split('T')[0] 
      })));
    } catch (error) {
      console.error('Messages fetch error:', error);
    }
    setIsAdminView(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-sky-glow animate-pulse text-xl">Yükleniyor...</div>
      </div>
    );
  }

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
