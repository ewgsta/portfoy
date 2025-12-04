import React, { useState, useEffect } from 'react';
import { NavItem } from '../types';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems: NavItem[] = [
  { label: 'Başlangıç', href: '#hero' },
  { label: 'Hakkımda', href: '#about' },
  { label: 'Projeler', href: '#projects' },
  { label: 'İletişim', href: '#contact' },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        isScrolled 
          ? 'bg-[#020617]/80 backdrop-blur-md border-sky-glow/10 py-4' 
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
        {/* Logo - Left */}
        <a href="#" className="text-2xl font-bold tracking-tighter text-white relative group z-10">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-glow to-blue-500">
            Furkan (ewgsta)
          </span>
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-sky-glow to-blue-500 transition-all group-hover:w-full opacity-70" />
        </a>

        {/* Desktop Nav - Absolute Center */}
        <div className="hidden md:flex space-x-12 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group"
            >
              {item.label}
              {/* Blue light effect on hover */}
              <span className="absolute inset-x-0 -bottom-2 h-px bg-gradient-to-r from-transparent via-sky-glow to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out opacity-70" />
            </a>
          ))}
        </div>

        {/* Mobile Toggle - Right */}
        <button 
          className="md:hidden text-slate-200 hover:text-sky-glow transition-colors z-10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#020617] border-b border-sky-glow/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-6 text-center">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg text-slate-300 hover:text-sky-glow transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;