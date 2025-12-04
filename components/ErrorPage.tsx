import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorPageProps {
  onRetry: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ onRetry }) => {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <AlertTriangle size={64} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-3">Bağlantı Hatası</h1>
          <p className="text-slate-400">
            Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin.
          </p>
        </div>
        
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <RefreshCw size={20} />
          Tekrar Dene
        </button>
        
        <div className="mt-8 text-slate-600 text-sm">
          <p>Hata devam ederse:</p>
          <ul className="mt-2 space-y-1">
            <li>• MongoDB servisinin çalıştığından emin olun</li>
            <li>• Backend sunucusunun aktif olduğunu kontrol edin</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
