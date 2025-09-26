
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all requests starting with /api to the backend server
      '/api': {
        // IMPORTANT: Replace this with the actual URL of your local backend server
        target: 'http://localhost:3001', // Assuming your backend runs on port 3001
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, ''), // Rewrite the path: remove /api
      },
    },
  },
});
