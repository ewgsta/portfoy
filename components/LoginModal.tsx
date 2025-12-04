import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X } from 'lucide-react';

interface LoginModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onSuccess, onClose }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length <= 6) {
        setPin(val);
        setError(false);
    }
    
    if (val === '123456') {
        setTimeout(onSuccess, 300);
    } else if (val.length === 6) {
        setError(true);
        setTimeout(() => setPin(''), 500);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-xl flex items-center justify-center p-4"
      >
        <div className="max-w-md w-full relative">
            <button 
                onClick={onClose}
                className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors"
            >
                <X size={24} />
            </button>

            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-[#0f172a] border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center"
            >
                <div className={`p-4 rounded-full mb-6 transition-colors duration-300 ${error ? 'bg-red-500/20 text-red-500' : 'bg-sky-glow/20 text-sky-glow'}`}>
                    <Lock size={32} />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Yönetici Erişimi</h2>
                <p className="text-slate-400 mb-8 text-sm">Devam etmek için 6 haneli güvenlik kodunu girin.</p>

                <div className="relative w-full max-w-[240px]">
                    <input
                        ref={inputRef}
                        type="text"
                        value={pin}
                        onChange={handleInputChange}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        inputMode="numeric"
                    />
                    <div className="flex justify-between gap-2">
                        {[...Array(6)].map((_, i) => (
                            <div 
                                key={i}
                                className={`
                                    w-10 h-12 rounded-lg border flex items-center justify-center text-xl font-mono font-bold transition-all duration-200
                                    ${pin[i] 
                                        ? 'border-sky-glow bg-sky-glow/10 text-white' 
                                        : error 
                                            ? 'border-red-500/50 bg-red-500/5' 
                                            : 'border-white/10 bg-white/5 text-slate-500'
                                    }
                                `}
                            >
                                {pin[i] ? '•' : ''}
                            </div>
                        ))}
                    </div>
                </div>

                {error && (
                    <motion.p 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="text-red-400 text-xs mt-4 font-mono"
                    >
                        Erişim Reddedildi: Geçersiz Kod
                    </motion.p>
                )}
            </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginModal;