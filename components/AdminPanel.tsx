import React, { useState, useEffect } from 'react';
import { Project, SiteConfig, ContactMessage } from '../types';
import { 
    LayoutDashboard, Plus, Trash2, Edit2, LogOut, 
    CheckCircle, AlertCircle, FileText, Search,
    MessageSquare, Eye, MousePointer, Activity, Menu, ChevronLeft, ChevronRight, FolderOpen, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../src/api/client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AdminPanelProps {
  projects: Project[];
  siteConfig: SiteConfig;
  messages: ContactMessage[];
  onUpdateProjects: (projects: Project[]) => void;
  onUpdateConfig: (config: SiteConfig) => void;
  onUpdateMessages: (msgs: ContactMessage[]) => void;
  onExit: () => void;
}

type Tab = 'dashboard' | 'content' | 'projects' | 'messages' | 'seo';

interface AnalyticsData {
  totals: {
    pageViews: number;
    projectClicks: number;
    uniqueVisitors: number;
    unreadMessages: number;
    totalMessages: number;
    totalProjects: number;
  };
  changes: {
    viewsChange: number;
    clicksChange: number;
  };
  chart: {
    labels: string[];
    pageViews: number[];
    projectClicks: number[];
  };
}

const PaginationControls = ({ page, setPage, total }: { page: number, setPage: (n: number) => void, total: number }) => (
    <div className="flex justify-center items-center gap-4 mt-4">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-2 rounded bg-white/5 disabled:opacity-30 hover:bg-white/10 transition-colors">
            <ChevronLeft size={20} />
        </button>
        <span className="text-sm text-slate-400">Sayfa {page} / {Math.max(1, total)}</span>
        <button disabled={page === total || total === 0} onClick={() => setPage(page + 1)} className="p-2 rounded bg-white/5 disabled:opacity-30 hover:bg-white/10 transition-colors">
            <ChevronRight size={20} />
        </button>
    </div>
);

const SidebarItem = ({ id, label, icon: Icon, activeTab, onClick, sidebarOpen }: { id: Tab, label: string, icon: any, activeTab: Tab, onClick: (id: Tab) => void, sidebarOpen: boolean }) => (
    <button onClick={() => onClick(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === id ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/40' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
        <Icon size={20} className="shrink-0" />
        {sidebarOpen && <span className="font-medium whitespace-nowrap">{label}</span>}
    </button>
);

const FormSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
        <h3 className="text-xl font-semibold text-white mb-6 border-b border-white/5 pb-4">{title}</h3>
        <div className="space-y-6">{children}</div>
    </div>
);

const InputGroup = ({ label, value, onChange, type="text" }: { label: string, value: string, onChange: (v: string) => void, type?: string }) => (
    <div>
        <label className="block text-xs text-slate-400 mb-1.5 uppercase font-bold tracking-wider">{label}</label>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full bg-[#020617] border border-white/10 rounded-lg p-3 text-white focus:border-sky-500 outline-none transition-colors" />
    </div>
);

const TextAreaGroup = ({ label, value, onChange, rows=3 }: { label: string, value: string, onChange: (v: string) => void, rows?: number }) => (
    <div>
        <label className="block text-xs text-slate-400 mb-1.5 uppercase font-bold tracking-wider">{label}</label>
        <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} className="w-full bg-[#020617] border border-white/10 rounded-lg p-3 text-white focus:border-sky-500 outline-none resize-none transition-colors" />
    </div>
);

const AdminPanel: React.FC<AdminPanelProps> = ({ projects, siteConfig, messages, onUpdateProjects, onUpdateConfig, onUpdateMessages, onExit }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectFormData, setProjectFormData] = useState<Partial<Project>>({});
  const [configFormData, setConfigFormData] = useState<SiteConfig>(siteConfig);
  const [projectsPage, setProjectsPage] = useState(1);
  const [messagesPage, setMessagesPage] = useState(1);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [toasts, setToasts] = useState<{id: number, message: string, type: 'success' | 'error'}[]>([]);
  const itemsPerPage = 5;

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  // Fetch analytics on mount
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await api.getAnalyticsStats();
        setAnalytics(data);
      } catch (error) {
        console.error('Analytics fetch error:', error);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (JSON.stringify(configFormData) !== JSON.stringify(siteConfig)) {
        try {
          await api.updateConfig(configFormData);
          onUpdateConfig(configFormData);
          showToast('Değişiklikler otomatik kaydedildi', 'success');
        } catch (error) {
          showToast('Kaydetme başarısız', 'error');
        }
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [configFormData, onUpdateConfig, siteConfig]);

  const handleDeleteMessage = async (id: number | string) => {
    try {
      await api.deleteMessage(String(id));
      onUpdateMessages(messages.filter(m => m.id !== id));
      showToast('Mesaj silindi.', 'success');
    } catch { showToast('Mesaj silinemedi.', 'error'); }
  };

  const handleToggleRead = async (id: number | string) => {
    const msg = messages.find(m => m.id === id);
    if (!msg) return;
    try {
      await api.toggleMessageRead(String(id), !msg.isRead);
      onUpdateMessages(messages.map(m => m.id === id ? {...m, isRead: !m.isRead} : m));
    } catch { showToast('Güncelleme başarısız.', 'error'); }
  };

  const handleEditProject = (project: Project) => { setEditingProject(project); setProjectFormData(project); setIsModalOpen(true); };
  const handleAddNewProject = () => { setEditingProject(null); setProjectFormData({ title: '', description: '', tags: [], link: '#', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80' }); setIsModalOpen(true); };

  const handleDeleteProject = async (id: number | string) => {
    if (confirm('Bu projeyi silmek istediğinize emin misiniz?')) {
      try { await api.deleteProject(String(id)); onUpdateProjects(projects.filter(p => p.id !== id)); showToast('Proje silindi.', 'success'); }
      catch { showToast('Proje silinemedi.', 'error'); }
    }
  };

  const handleSaveProject = async () => {
    if (!projectFormData.title) { showToast('Başlık gerekli.', 'error'); return; }
    const tags = typeof projectFormData.tags === 'string' ? (projectFormData.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean) : (projectFormData.tags || []);
    const projectToSave = { title: projectFormData.title, description: projectFormData.description, image: projectFormData.image, link: projectFormData.link, tags };
    try {
      if (editingProject) {
        const updated = await api.updateProject(String(editingProject.id), projectToSave);
        onUpdateProjects(projects.map(p => p.id === editingProject.id ? { ...updated, id: updated._id } : p));
        showToast('Proje güncellendi.', 'success');
      } else {
        const created = await api.createProject(projectToSave);
        onUpdateProjects([...projects, { ...created, id: created._id }]);
        showToast('Yeni proje oluşturuldu.', 'success');
      }
      setIsModalOpen(false);
    } catch { showToast('İşlem başarısız.', 'error'); }
  };

  const paginate = (array: any[], page: number) => array.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = (array: any[]) => Math.ceil(array.length / itemsPerPage);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e293b', titleColor: '#fff', bodyColor: '#94a3b8', borderColor: '#334155', borderWidth: 1 } },
    scales: { x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } } }
  };

  const lineChartData = analytics ? {
    labels: analytics.chart.labels,
    datasets: [{ label: 'Görüntülenme', data: analytics.chart.pageViews, borderColor: '#0ea5e9', backgroundColor: 'rgba(14, 165, 233, 0.1)', fill: true, tension: 0.4 }]
  } : { labels: [], datasets: [] };

  const barChartData = analytics ? {
    labels: analytics.chart.labels,
    datasets: [{ label: 'Tıklamalar', data: analytics.chart.projectClicks, backgroundColor: '#8b5cf6', borderRadius: 6 }]
  } : { labels: [], datasets: [] };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex font-sans overflow-hidden">
      <motion.aside animate={{ width: sidebarOpen ? 260 : 80 }} className="bg-[#0f172a] border-r border-white/5 flex flex-col z-20 shrink-0">
        <div className="p-6 flex items-center justify-between border-b border-white/5 h-20">
          {sidebarOpen ? <div className="font-bold text-xl tracking-tight text-white">Admin<span className="text-sky-500">.</span>Panel</div> : <div className="font-bold text-xl text-sky-500 mx-auto">A.</div>}
        </div>
        <div className="p-4 space-y-2 flex-1 overflow-y-auto overflow-x-hidden">
          <SidebarItem id="dashboard" label="Analizler" icon={LayoutDashboard} activeTab={activeTab} onClick={setActiveTab} sidebarOpen={sidebarOpen} />
          <SidebarItem id="content" label="Site İçeriği" icon={FileText} activeTab={activeTab} onClick={setActiveTab} sidebarOpen={sidebarOpen} />
          <SidebarItem id="projects" label="Projeler" icon={Activity} activeTab={activeTab} onClick={setActiveTab} sidebarOpen={sidebarOpen} />
          <SidebarItem id="messages" label="Mesajlar" icon={MessageSquare} activeTab={activeTab} onClick={setActiveTab} sidebarOpen={sidebarOpen} />
          <SidebarItem id="seo" label="SEO Ayarları" icon={Search} activeTab={activeTab} onClick={setActiveTab} sidebarOpen={sidebarOpen} />
        </div>
        <div className="p-4 border-t border-white/5">
          <button onClick={() => { api.logout(); onExit(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors ${!sidebarOpen && 'justify-center'}`}>
            <LogOut size={20} className="shrink-0" />{sidebarOpen && <span className="whitespace-nowrap">Çıkış Yap</span>}
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        <header className="h-20 bg-[#020617]/80 backdrop-blur-md border-b border-white/5 px-8 flex items-center justify-between z-10 shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"><Menu size={24} /></button>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400 hidden sm:block">Son güncelleme: <span className="text-white">Otomatik (2sn)</span></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Eye size={24}/></div>
                    {analytics && <span className={`text-sm font-mono ${analytics.changes.viewsChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>{analytics.changes.viewsChange >= 0 ? '+' : ''}{analytics.changes.viewsChange}%</span>}
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{analyticsLoading ? '...' : analytics?.totals.pageViews.toLocaleString() || '0'}</div>
                  <div className="text-slate-500 text-sm">Toplam Görüntülenme</div>
                </div>
                <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500"><MousePointer size={24}/></div>
                    {analytics && <span className={`text-sm font-mono ${analytics.changes.clicksChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>{analytics.changes.clicksChange >= 0 ? '+' : ''}{analytics.changes.clicksChange}%</span>}
                  </div>
                                    <div className="text-3xl font-bold text-white mb-1">{analyticsLoading ? '...' : analytics?.totals?.pageViews.toLocaleString() || '0'}</div>
                  <div className="text-slate-500 text-sm">Toplam Görüntülenme</div>
                </div>
                <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500"><MousePointer size={24}/></div>
                    {analytics && <span className={`text-sm font-mono ${analytics.changes.clicksChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>{analytics.changes.clicksChange >= 0 ? '+' : ''}{analytics.changes.clicksChange}%</span>}
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{analyticsLoading ? '...' : analytics?.totals?.projectClicks.toLocaleString() || '0'}</div>
                  <div className="text-slate-500 text-sm">Proje Tıklamaları</div>
                </div>
                <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500"><Activity size={24}/></div>
                    <span className="text-slate-500 text-sm font-mono">Tekil</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{analyticsLoading ? '...' : analytics?.totals?.uniqueVisitors.toLocaleString() || '0'}</div>
                  <div className="text-slate-500 text-sm">Tekil Ziyaretçi</div>
                </div>
                <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-sky-500/10 rounded-xl text-sky-500"><MessageSquare size={24}/></div>
                    <span className="text-slate-500 text-sm font-mono">Bekleyen</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{analyticsLoading ? '...' : analytics?.totals?.unreadMessages || messages.filter(m => !m.isRead).length}</div>
                  <div className="text-slate-500 text-sm">Yeni Mesaj</div>
                </div>
                <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-green-500/10 rounded-xl text-green-500"><FolderOpen size={24}/></div>
                    <span className="text-green-400 text-sm font-mono">Aktif</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{analyticsLoading ? '...' : analytics?.totals?.totalProjects || projects.length}</div>
                  <div className="text-slate-500 text-sm">Toplam Proje</div>
                </div>
                </div>
                <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500"><Activity size={24}/></div>
                    <span className="text-slate-500 text-sm font-mono">Tekil</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{analyticsLoading ? '...' : analytics?.totals.uniqueVisitors.toLocaleString() || '0'}</div>
                  <div className="text-slate-500 text-sm">Tekil Ziyaretçi</div>
                </div>
                <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-sky-500/10 rounded-xl text-sky-500"><MessageSquare size={24}/></div>
                    <span className="text-slate-500 text-sm font-mono">Bekleyen</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{analyticsLoading ? '...' : analytics?.totals.unreadMessages || messages.filter(m => !m.isRead).length}</div>
                  <div className="text-slate-500 text-sm">Yeni Mesaj</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Sayfa Görüntülenmeleri</h3>
                    <TrendingUp size={20} className="text-sky-500" />
                  </div>
                  <div className="h-64">{analytics && <Line data={lineChartData} options={chartOptions} />}</div>
                </div>
                <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Proje Tıklamaları</h3>
                    <MousePointer size={20} className="text-purple-500" />
                  </div>
                  <div className="h-64">{analytics && <Bar data={barChartData} options={chartOptions} />}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="max-w-6xl mx-auto space-y-6 pb-20">
              <FormSection title="Hero Bölümü">
                <div className="grid md:grid-cols-2 gap-6">
                  <InputGroup label="Ana Başlık" value={configFormData.hero.title} onChange={v => setConfigFormData({...configFormData, hero: {...configFormData.hero, title: v}})} />
                  <InputGroup label="Buton Metni" value={configFormData.hero.ctaText} onChange={v => setConfigFormData({...configFormData, hero: {...configFormData.hero, ctaText: v}})} />
                </div>
                <TextAreaGroup label="Alt Metin" value={configFormData.hero.subtitle} onChange={v => setConfigFormData({...configFormData, hero: {...configFormData.hero, subtitle: v}})} />
              </FormSection>
              <FormSection title="Hakkımda Bölümü">
                <InputGroup label="Başlık" value={configFormData.about.title} onChange={v => setConfigFormData({...configFormData, about: {...configFormData.about, title: v}})} />
                <TextAreaGroup label="Detaylı Açıklama" value={configFormData.about.description} onChange={v => setConfigFormData({...configFormData, about: {...configFormData.about, description: v}})} rows={5} />
              </FormSection>
              <FormSection title="Projeler Bölümü Ayarları">
                <div className="grid md:grid-cols-2 gap-6">
                  <InputGroup label="Bölüm Başlığı" value={configFormData.projectsSection.title} onChange={v => setConfigFormData({...configFormData, projectsSection: {...configFormData.projectsSection, title: v}})} />
                  <InputGroup label="GitHub Buton Metni" value={configFormData.projectsSection.githubButtonText} onChange={v => setConfigFormData({...configFormData, projectsSection: {...configFormData.projectsSection, githubButtonText: v}})} />
                </div>
                <InputGroup label="Alt Başlık" value={configFormData.projectsSection.subtitle} onChange={v => setConfigFormData({...configFormData, projectsSection: {...configFormData.projectsSection, subtitle: v}})} />
              </FormSection>
              <FormSection title="İletişim & Footer">
                <div className="grid md:grid-cols-2 gap-6">
                  <InputGroup label="Bölüm Başlığı" value={configFormData.contact.title} onChange={v => setConfigFormData({...configFormData, contact: {...configFormData.contact, title: v}})} />
                  <InputGroup label="Alt Başlık" value={configFormData.contact.subtitle} onChange={v => setConfigFormData({...configFormData, contact: {...configFormData.contact, subtitle: v}})} />
                  <InputGroup label="Form Başlığı" value={configFormData.contact.formTitle} onChange={v => setConfigFormData({...configFormData, contact: {...configFormData.contact, formTitle: v}})} />
                  <InputGroup label="Form Buton Metni" value={configFormData.contact.buttonText} onChange={v => setConfigFormData({...configFormData, contact: {...configFormData.contact, buttonText: v}})} />
                </div>
                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                  <InputGroup label="Email Bilgisi" value={configFormData.contact.infoEmail} onChange={v => setConfigFormData({...configFormData, contact: {...configFormData.contact, infoEmail: v}})} />
                  <InputGroup label="Telefon Bilgisi" value={configFormData.contact.infoPhone} onChange={v => setConfigFormData({...configFormData, contact: {...configFormData.contact, infoPhone: v}})} />
                  <InputGroup label="Adres Bilgisi" value={configFormData.contact.infoAddress} onChange={v => setConfigFormData({...configFormData, contact: {...configFormData.contact, infoAddress: v}})} />
                </div>
                <InputGroup label="Footer Metni" value={configFormData.contact.footerText} onChange={v => setConfigFormData({...configFormData, contact: {...configFormData.contact, footerText: v}})} />
              </FormSection>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="max-w-6xl mx-auto h-full flex flex-col">
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h2 className="text-2xl font-bold text-white">Projeler</h2>
                <button onClick={handleAddNewProject} className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18} /> Yeni Ekle</button>
              </div>
              <div className="bg-[#0f172a] rounded-2xl border border-white/5 overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 text-slate-400 text-sm"><tr><th className="p-4">Proje</th><th className="p-4">Etiketler</th><th className="p-4 text-right">İşlemler</th></tr></thead>
                    <tbody className="divide-y divide-white/5">
                      {paginate(projects, projectsPage).map((p: Project) => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 flex items-center gap-4">
                            <img src={p.image} className="w-12 h-12 rounded-lg object-cover bg-slate-800" alt=""/>
                            <div><div className="font-medium text-white">{p.title}</div><div className="text-xs text-slate-500 truncate max-w-[200px]">{p.description}</div></div>
                          </td>
                          <td className="p-4"><div className="flex flex-wrap gap-1">{p.tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300">{t}</span>)}</div></td>
                          <td className="p-4 text-right space-x-2 whitespace-nowrap">
                            <button onClick={() => handleEditProject(p)} className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg"><Edit2 size={16}/></button>
                            <button onClick={() => handleDeleteProject(p.id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg"><Trash2 size={16}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-white/5 mt-auto"><PaginationControls page={projectsPage} setPage={setProjectsPage} total={totalPages(projects)} /></div>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="max-w-4xl mx-auto h-full flex flex-col">
              <h2 className="text-2xl font-bold text-white mb-6 shrink-0">Gelen Kutusu</h2>
              <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                {messages.length === 0 ? <div className="text-center text-slate-500 py-20">Henüz mesaj yok.</div> : paginate(messages, messagesPage).map((msg: ContactMessage) => (
                  <div key={msg.id} className={`bg-[#0f172a] p-6 rounded-2xl border ${msg.isRead ? 'border-white/5 opacity-70' : 'border-sky-500/30 shadow-lg shadow-sky-900/10'} transition-all`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${msg.isRead ? 'bg-slate-600' : 'bg-green-500'}`} />
                        <div><h4 className="font-bold text-white">{msg.name}</h4><div className="text-xs text-slate-400">{msg.email}</div></div>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{msg.date}</span>
                    </div>
                    <p className="text-slate-300 text-sm mb-4 leading-relaxed bg-black/20 p-4 rounded-lg">{msg.message}</p>
                    <div className="flex gap-3 justify-end">
                      <button onClick={() => handleToggleRead(msg.id)} className="text-xs px-3 py-1.5 rounded border border-white/10 hover:bg-white/5 text-slate-400 transition-colors">{msg.isRead ? 'Okunmadı İşaretle' : 'Okundu İşaretle'}</button>
                      <button onClick={() => handleDeleteMessage(msg.id)} className="text-xs px-3 py-1.5 rounded border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors">Sil</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 mt-auto"><PaginationControls page={messagesPage} setPage={setMessagesPage} total={totalPages(messages)} /></div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FormSection title="SEO Ayarları">
                  <InputGroup label="Sayfa Başlığı (Title)" value={configFormData.seo.title} onChange={v => setConfigFormData({...configFormData, seo: {...configFormData.seo, title: v}})} />
                  <TextAreaGroup label="Meta Açıklama (Description)" value={configFormData.seo.description} onChange={v => setConfigFormData({...configFormData, seo: {...configFormData.seo, description: v}})} rows={4} />
                  <InputGroup label="Anahtar Kelimeler (Keywords)" value={configFormData.seo.keywords} onChange={v => setConfigFormData({...configFormData, seo: {...configFormData.seo, keywords: v}})} />
                </FormSection>
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4">Google Arama Önizlemesi</h3>
                  <div className="bg-white p-6 rounded-2xl shadow-sm font-sans">
                    <div className="text-[#1a0dab] text-xl cursor-pointer hover:underline truncate">{configFormData.seo.title || "Sayfa Başlığı"}</div>
                    <div className="text-[#006621] text-sm my-1">https://yoursite.com</div>
                    <div className="text-[#545454] text-sm line-clamp-2 leading-relaxed">{configFormData.seo.description || "Sayfa açıklaması burada görünecek..."}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div className="bg-[#0f172a] border border-white/10 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-4" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <h3 className="text-xl font-bold text-white mb-4 border-b border-white/5 pb-2">{editingProject ? 'Projeyi Düzenle' : 'Yeni Proje Oluştur'}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <InputGroup label="Proje Başlığı" value={projectFormData.title || ''} onChange={v => setProjectFormData({...projectFormData, title: v})} />
                <InputGroup label="Resim URL" value={projectFormData.image || ''} onChange={v => setProjectFormData({...projectFormData, image: v})} />
              </div>
              <TextAreaGroup label="Proje Açıklaması" value={projectFormData.description || ''} onChange={v => setProjectFormData({...projectFormData, description: v})} />
              <InputGroup label="Etiketler (Virgül ile ayırın)" value={Array.isArray(projectFormData.tags) ? projectFormData.tags.join(',') : projectFormData.tags || ''} onChange={v => setProjectFormData({...projectFormData, tags: v as any})} />
              <InputGroup label="Proje Linki" value={projectFormData.link || ''} onChange={v => setProjectFormData({...projectFormData, link: v})} />
              <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">İptal</button>
                <button onClick={handleSaveProject} className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 rounded-lg text-white font-medium shadow-lg shadow-sky-900/20">Kaydet</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div key={toast.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border ${toast.type === 'success' ? 'bg-green-900/90 border-green-500/30 text-green-200' : 'bg-red-900/90 border-red-500/30 text-red-200'}`}>
              {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span className="text-sm font-medium">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminPanel;
