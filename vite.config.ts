import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  define: {
    'process.env': {
      // Esto permite que el código acceda a process.env.API_KEY sin crashear en el navegador.
      // Vercel inyectará el valor durante el build si está configurado en las variables de entorno del proyecto.
      API_KEY: process.env.API_KEY
    }
  }
});