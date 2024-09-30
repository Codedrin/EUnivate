import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backendBaseUrl = process.env.VITE_REACT_APP_BACKEND_BASEURL;

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: backendBaseUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
