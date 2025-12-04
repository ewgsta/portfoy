
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SiteConfig } from '../types';

interface HeroProps {
  config: SiteConfig['hero'];
}

const Hero: React.FC<HeroProps> = ({ config }) => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative pt-20 overflow-hidden">
      
      {/* Cinematic Glow - Blue Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[50vh] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-blue-900/10 via-sky-glow/5 to-transparent blur-3xl pointer-events-none opacity-40" />

      <div className="max-w-4xl mx-auto px-6 text-center z-10">
        
        {/* Japanese Title Element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-4 md:mb-6 text-xs md:text-base text-sky-glow/80 font-light tracking-[0.5em] uppercase"
        >
          青 (Ao - Mavi)
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 md:mb-8 leading-tight"
        >
          {config.title.split(' ').map((word, i, arr) => (
             i === arr.length - 2 ? (
                 <React.Fragment key={i}>
                     {word} <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-glow via-starlight-blue to-blue-500">{arr[i+1]}</span>
                 </React.Fragment>
             ) : i === arr.length - 1 ? null : word + ' '
          ))}
          {/* Fallback if logic fails or simple text: just render title */}
          {config.title.split(' ').length < 2 && config.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed font-light px-4"
        >
          {config.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <a
            href="#projects"
            className="group relative px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium overflow-hidden transition-all hover:border-sky-glow/50 hover:bg-white/10 w-full sm:w-auto text-center"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-glow/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative flex items-center justify-center gap-2">
              {config.ctaText}
              <ArrowRight size={16} className="text-sky-glow group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
          
          <a
            href="#contact"
            className="text-slate-400 hover:text-white transition-colors underline decoration-1 decoration-slate-700 underline-offset-8 hover:decoration-sky-glow py-2 sm:py-0"
          >
            Benimle İletişime Geç
          </a>
        </motion.div>
      </div>
      
      {/* Vertical Thread Line - Blue Data Stream */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: '150px' }}
        transition={{ duration: 1.5, delay: 1 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-sky-glow/50 to-transparent opacity-50" 
      />
    </section>
  );
};

export default Hero;
