
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Music, Disc, ExternalLink, Gamepad2, Loader2, CheckCircle } from 'lucide-react';
import { SiteConfig } from '../types';
import { api } from '../src/api/client';

interface LanyardData {
  discord_user: {
    username: string;
    avatar: string;
    discriminator: string;
    id: string;
    display_name: string;
  };
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: {
    name: string;
    state?: string;
    details?: string;
    type: number;
    application_id?: string;
    assets?: {
        large_image?: string;
        small_image?: string;
        large_text?: string;
    }
  }[];
  listening_to_spotify: boolean;
  spotify?: {
    track_id: string;
    song: string;
    artist: string;
    album_art_url: string;
  }
}

interface ContactProps {
    config: SiteConfig['contact'];
}

const Contact: React.FC<ContactProps> = ({ config }) => {
  const [lanyardData, setLanyardData] = useState<LanyardData | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const DISCORD_ID = "752050889958883380";

  useEffect(() => {
    let ws: WebSocket | null = null;
    let heartbeatInterval: ReturnType<typeof setInterval>;

    const connect = () => {
      ws = new WebSocket('wss://api.lanyard.rest/socket');

      ws.onopen = () => {
        // Op 2: Initialize
        ws?.send(JSON.stringify({
          op: 2,
          d: { subscribe_to_id: DISCORD_ID }
        }));
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const { op, t, d } = message;

        // Op 1: Hello (Set heartbeat)
        if (op === 1) {
          heartbeatInterval = setInterval(() => {
            ws?.send(JSON.stringify({ op: 3 }));
          }, d.heartbeat_interval);
        }

        // Event: INIT_STATE or PRESENCE_UPDATE
        if (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') {
          setLanyardData(d);
        }
      };

      ws.onclose = () => {
        clearInterval(heartbeatInterval);
        setTimeout(connect, 5000); // Reconnect
      };
    };

    connect();

    return () => {
      clearInterval(heartbeatInterval);
      ws?.close();
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'dnd': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAssetUrl = (appId: string | undefined, assetId: string | undefined) => {
      if (!appId || !assetId) return null;
      if (assetId.startsWith('mp:external')) {
          return `https://media.discordapp.net/${assetId.replace('mp:', '')}`;
      }
      return `https://cdn.discordapp.com/app-assets/${appId}/${assetId}.png`;
  };

  return (
    <section id="contact" className="py-20 md:py-32 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-b from-transparent via-sky-glow/40 to-transparent opacity-60" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 tracking-tight">
            {config.title}
          </h2>
          <p className="text-slate-400 text-base md:text-lg font-light px-4">
            {config.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Side: Info & Widgets */}
          <div className="flex flex-col gap-6 order-1 lg:order-1">
            
            {/* 1. Enhanced Lanyard Widget */}
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col gap-4"
            >
                {lanyardData ? (
                    <>
                        {/* Header: User Info */}
                        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                            <div className="relative shrink-0">
                                <img 
                                    src={`https://cdn.discordapp.com/avatars/${lanyardData.discord_user.id}/${lanyardData.discord_user.avatar}.png?size=128`} 
                                    alt="Avatar" 
                                    className="w-12 h-12 rounded-full border border-white/10"
                                />
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0f172a] ${getStatusColor(lanyardData.discord_status)}`} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-base leading-tight">{lanyardData.discord_user.display_name}</h4>
                                <div className="text-xs text-slate-500">@{lanyardData.discord_user.username}</div>
                            </div>
                        </div>

                        {/* Dynamic Content: Spotify OR Activity OR Status */}
                        {lanyardData.listening_to_spotify && lanyardData.spotify ? (
                             <a 
                                href={`https://open.spotify.com/track/${lanyardData.spotify.track_id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-4 bg-green-500/5 hover:bg-green-500/10 transition-colors p-3 rounded-xl border border-green-500/20 group"
                             >
                                 <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden shadow-lg">
                                     <img 
                                        src={lanyardData.spotify.album_art_url} 
                                        alt="Album Art" 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                     />
                                     <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <Music size={20} className="text-white drop-shadow-md" />
                                     </div>
                                 </div>
                                 <div className="min-w-0 flex-1">
                                     <div className="text-xs text-green-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                                         <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Spotify
                                     </div>
                                     <div className="text-white font-medium truncate text-sm">{lanyardData.spotify.song}</div>
                                     <div className="text-slate-400 text-xs truncate">{lanyardData.spotify.artist}</div>
                                 </div>
                             </a>
                        ) : lanyardData.activities.length > 0 && lanyardData.activities[0].name !== 'Spotify' ? (
                             <div className="flex items-center gap-4 bg-blue-500/5 p-3 rounded-xl border border-blue-500/20">
                                 <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-slate-800 flex items-center justify-center shadow-lg">
                                    {lanyardData.activities[0].assets?.large_image ? (
                                        <img 
                                            src={getAssetUrl(lanyardData.activities[0].application_id, lanyardData.activities[0].assets.large_image) || ''} 
                                            alt={lanyardData.activities[0].name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Gamepad2 size={32} className="text-blue-400" />
                                    )}
                                 </div>
                                 <div className="min-w-0 flex-1">
                                    <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">
                                        {lanyardData.activities[0].name}
                                    </div>
                                    <div className="text-white font-medium truncate text-sm">
                                        {lanyardData.activities[0].details || lanyardData.activities[0].state || "Activity"}
                                    </div>
                                    {lanyardData.activities[0].state && (
                                        <div className="text-slate-400 text-xs truncate">{lanyardData.activities[0].state}</div>
                                    )}
                                 </div>
                             </div>
                        ) : (
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                                <p className="text-slate-400 text-sm">Şu an sessizliğin tadını çıkarıyor.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center gap-4 animate-pulse">
                        <div className="w-12 h-12 rounded-full bg-white/10" />
                        <div className="space-y-2 flex-1">
                            <div className="h-4 w-1/3 bg-white/10 rounded" />
                            <div className="h-4 w-1/2 bg-white/10 rounded" />
                        </div>
                    </div>
                )}
            </motion.div>

            {/* 2. Contact Info Grid */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                <div className="glass-panel p-5 rounded-xl flex items-center gap-4 hover:bg-white/5 transition-colors">
                    <div className="p-3 rounded-full bg-blue-900/30 text-sky-glow">
                        <Mail size={20} />
                    </div>
                    <div className="overflow-hidden">
                        <div className="text-xs text-slate-500">Email</div>
                        <div className="text-sm text-white truncate">{config.infoEmail}</div>
                    </div>
                </div>
                <div className="glass-panel p-5 rounded-xl flex items-center gap-4 hover:bg-white/5 transition-colors">
                    <div className="p-3 rounded-full bg-blue-900/30 text-sky-glow">
                        <Phone size={20} />
                    </div>
                    <div>
                        <div className="text-xs text-slate-500">Telefon</div>
                        <div className="text-sm text-white">{config.infoPhone}</div>
                    </div>
                </div>
            </motion.div>

            {/* 3. Google Maps Visual */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="glass-panel p-1 rounded-xl h-40 relative group overflow-hidden"
            >
                 <a 
                    href="https://maps.google.com/?q=Istanbul,Turkey" 
                    target="_blank" 
                    rel="noreferrer"
                    className="block w-full h-full relative"
                >
                     {/* Abstract Map Background */}
                     <div className="w-full h-full bg-[#1e293b] relative opacity-60 group-hover:opacity-80 transition-opacity">
                         {/* Stylized streets */}
                         <div className="absolute top-0 left-1/4 w-1 h-full bg-white/5" />
                         <div className="absolute top-1/3 left-0 w-full h-1 bg-white/5" />
                         <div className="absolute top-0 right-1/3 w-1 h-full bg-white/5" />
                         <div className="absolute bottom-1/4 left-0 w-full h-1 bg-white/5 rotate-12" />
                     </div>
                     
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-20">
                         <MapPin size={32} className="text-red-500 drop-shadow-lg" />
                         <span className="text-xs font-semibold bg-black/50 px-2 py-1 rounded text-white backdrop-blur-sm">{config.infoAddress}</span>
                     </div>

                     <div className="absolute inset-0 bg-sky-glow/5 group-hover:bg-transparent transition-colors z-10" />
                </a>
            </motion.div>

          </div>

          {/* Right Side: Form */}
          <motion.div
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="glass-panel p-6 md:p-8 rounded-2xl h-full flex flex-col justify-center order-2 lg:order-2"
          >
            <h3 className="text-2xl font-semibold text-white mb-6">{config.formTitle}</h3>
            {formStatus === 'success' ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <p className="text-white text-lg">Mesajınız gönderildi!</p>
                <button 
                  onClick={() => { setFormStatus('idle'); setFormData({ name: '', email: '', message: '' }); }}
                  className="mt-4 text-sky-glow hover:underline"
                >
                  Yeni mesaj gönder
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={async (e) => {
                e.preventDefault();
                if (!formData.name || !formData.email || !formData.message) return;
                setFormStatus('loading');
                try {
                  await api.sendMessage(formData);
                  setFormStatus('success');
                } catch (error) {
                  setFormStatus('error');
                  setTimeout(() => setFormStatus('idle'), 3000);
                }
              }}>
                  <div className="group">
                  <input 
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Adınız"
                      className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-sky-glow transition-colors text-lg"
                      required
                  />
                  </div>
                  <div className="group">
                  <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={config.emailPlaceholder}
                      className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-sky-glow transition-colors text-lg"
                      required
                  />
                  </div>
                  <div className="group">
                  <textarea 
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={config.messagePlaceholder}
                      className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-sky-glow transition-colors text-lg resize-none"
                      required
                  />
                  </div>
                  <div className="pt-4">
                      <button 
                      type="submit"
                      disabled={formStatus === 'loading'}
                      className="w-full bg-sky-glow/10 border border-sky-glow/20 text-sky-glow font-medium py-4 rounded hover:bg-sky-glow/20 transition-all tracking-wide disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                      {formStatus === 'loading' ? (
                        <><Loader2 size={20} className="animate-spin" /> Gönderiliyor...</>
                      ) : formStatus === 'error' ? (
                        'Hata! Tekrar deneyin'
                      ) : (
                        config.buttonText
                      )}
                      </button>
                  </div>
              </form>
            )}
          </motion.div>

        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex justify-center text-slate-600 text-sm font-mono">
            <p>{config.footerText}</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
