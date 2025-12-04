
import React from 'react';
import { motion } from 'framer-motion';
import { SiteConfig } from '../types';

interface AboutProps {
  config: SiteConfig['about'];
}

const About: React.FC<AboutProps> = ({ config }) => {
  return (
    <section id="about" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="h-[1px] w-12 bg-sky-glow/50"></span>
          <h2 className="text-sm font-medium tracking-widest uppercase text-slate-400">Kimim Ben?</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Main Text */}
          <div className="md:col-span-7 space-y-8">
            <motion.h3 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-semibold text-white leading-tight"
            >
              {config.title}
            </motion.h3>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6 text-slate-400 text-lg font-light leading-relaxed"
            >
              <p>{config.description}</p>
            </motion.div>
          </div>

          {/* Stats / Tech Stack - Glass Cards */}
          <div className="md:col-span-5 grid grid-cols-1 gap-4">
             <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-panel p-6 rounded-xl hover:bg-white/5 transition-colors"
             >
                <div className="text-sky-glow text-sm mb-2 font-mono">01. Estetik</div>
                <h4 className="text-xl font-medium text-white mb-2">Temiz, Minimalist</h4>
                <p className="text-slate-500 text-sm">Gözü yormayan, karanlık mod odaklı, akıcı animasyonlar ve derinlik hissi veren tasarımlar.</p>
             </motion.div>

             <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="glass-panel p-6 rounded-xl hover:bg-white/5 transition-colors"
             >
                <div className="text-blue-400 text-sm mb-2 font-mono">02. Teknoloji</div>
                <h4 className="text-xl font-medium text-white mb-2">Modern Stack</h4>
                <p className="text-slate-500 text-sm">Svelte ekosistemi, TypeScript güvenliği ve Vercel hızı ile güçlendirilmiş sağlam altyapılar.</p>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
