import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        // Local development proxy - Vercel handles this in production
        proxy: mode === 'development' ? {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
          }
        } : undefined
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        sourcemap: false
      }
    };
});
