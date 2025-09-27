
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    proxy: {
      // Proxy all requests starting with /api to the backend server
      '/api': {
        target: 'http://localhost:3001', // Backend runs on port 3001
        changeOrigin: true,
        // Keep /api prefix to match backend routes
      },
    },
  },
});
