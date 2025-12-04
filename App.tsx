import React, { useState, useEffect } from 'react';
import StarryBackground from './components/StarryBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import LoginModal from './components/LoginModal';
import AdminPanel from './components/AdminPanel';
import ErrorPage from './components/ErrorPage';
import { HeroSkeleton, AboutSkeleton, ProjectsSkeleton, ContactSkeleton, NavbarSkeleton } from './components/Skeleton';
import { Project, SiteConfig, ContactMessage } from './types';
import { api } from './src/api/client';

type AppState = 'loading' | 'ready' | 'error';

function App() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [appState, setAppState] = useState<AppState>('loading');
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchData = async () => {
    setAppState('loading');
    try {
      const [projectsData, configData] = await Promise.all([
        api.getProjects(),
        api.getConfig()
      ]);
      
      if (!configData || !projectsData) {
        throw new Error('Veri alınamadı');
      }
      
      setProjects(projectsData.map((p: any) => ({ ...p, id: p._id })));
      setSiteConfig(configData);
      
      // Check if already authenticated
      const token = api.getToken();
      if (token) {
        const valid = await api.verifyToken();
        setIsAuthenticated(valid);
      }
      
      setAppState('ready');
    } catch (error) {
      console.error('Data fetch error:', error);
      setAppState('error');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // SEO Effect
  useEffect(() => {
    if (siteConfig?.seo?.title) {
      document.title = siteConfig.seo.title;
      
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', siteConfig.seo.description);
    }
  }, [siteConfig?.seo]);

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

  // Hata durumu
  if (appState === 'error') {
    return <ErrorPage onRetry={fetchData} />;
  }

  // Admin paneli
  if (isAdminView && siteConfig && projects) {
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

  // Ana sayfa (skeleton veya gerçek içerik)
  return (
    <div className="relative min-h-screen">
      <StarryBackground />
      
      {appState === 'loading' || !siteConfig || !projects ? (
        <>
          <NavbarSkeleton />
          <main className="flex flex-col">
            <HeroSkeleton />
            <AboutSkeleton />
            <ProjectsSkeleton />
            <ContactSkeleton />
          </main>
        </>
      ) : (
        <>
          <Navbar />
          <main className="flex flex-col">
            <Hero config={siteConfig.hero} />
            <About config={siteConfig.about} />
            <Projects projects={projects} config={siteConfig.projectsSection} />
            <Contact config={siteConfig.contact} />
          </main>
        </>
      )}

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
