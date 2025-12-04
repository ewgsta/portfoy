
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Project, SiteConfig } from '../types';
import { ArrowUpRight, Github, ChevronRight, ChevronLeft } from 'lucide-react';

interface ProjectsProps {
  projects: Project[];
  config: SiteConfig['projectsSection'];
}

const Projects: React.FC<ProjectsProps> = ({ projects, config }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth / 2; // Scroll half view width
      container.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="projects" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background glow for the section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-blue-900/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* Header - More Compact */}
        <div className="px-6 md:px-12 flex flex-col md:flex-row justify-between items-end mb-8 md:mb-10 gap-4">
          <div className="max-w-xl">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-tight">{config.title}</h2>
            <p className="text-slate-400 font-light text-base md:text-lg">{config.subtitle}</p>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex gap-2">
              <button 
                onClick={() => scroll('left')} 
                className="p-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-sky-glow/30 text-white transition-all active:scale-95"
                aria-label="Previous Project"
              >
                  <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => scroll('right')} 
                className="p-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-sky-glow/30 text-white transition-all active:scale-95"
                aria-label="Next Project"
              >
                  <ChevronRight size={20} />
              </button>
          </div>
        </div>

        {/* 
          Carousel Container 
          Display 2 cards on desktop (calc(50% - gap)).
        */}
        <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 md:gap-6 pb-8 snap-x snap-mandatory scrollbar-none px-6 md:px-12"
            style={{ scrollBehavior: 'smooth' }}
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ root: scrollContainerRef }}
              transition={{ duration: 0.5 }}
              className="group glass-panel rounded-2xl relative overflow-hidden flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(50%-12px)] snap-start flex flex-col transition-all duration-500 hover:border-sky-glow/30"
            >
              {/* Image Section - Compact Height */}
              <div className="h-40 md:h-48 w-full relative overflow-hidden bg-[#020617]">
                  <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
                  
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                  />
                  
                  {/* ID Badge */}
                  <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md text-sky-glow font-mono text-[10px] px-2 py-0.5 rounded-full border border-white/10">
                     #{project.id.toString().padStart(2, '0')}
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#0b1120] to-transparent z-20 opacity-90" />
              </div>

              {/* Content Section - Compact Padding */}
              <div className="flex flex-col flex-grow p-5 bg-[#0b1120]/50 backdrop-blur-sm relative z-30 -mt-2">
                <div className="mb-2">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {project.tags.map(tag => (
                            <span key={tag} className="text-[10px] uppercase font-bold tracking-wider text-sky-300 bg-sky-900/20 px-1.5 py-0.5 rounded border border-sky-500/10">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-sky-400 transition-colors mb-1">
                      {project.title}
                    </h3>
                </div>
                
                <p className="text-slate-400 font-light leading-relaxed mb-4 text-xs md:text-sm line-clamp-2">
                  {project.description}
                </p>

                <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                    <a 
                        href={project.link} 
                        className="inline-flex items-center gap-2 text-white text-xs font-medium hover:text-sky-glow transition-all group/link"
                    >
                        İncele
                        <ArrowUpRight size={14} className="group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                    </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Action */}
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-4 flex justify-center"
        >
            <a 
                href="https://github.com/ewgsta" 
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0f172a] border border-white/10 hover:border-sky-glow/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-all group"
            >
                <Github size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                <span className="text-slate-300 text-sm group-hover:text-white font-medium tracking-wide">{config.githubButtonText}</span>
            </a>
        </motion.div>

      </div>
    </section>
  );
};

export default Projects;
