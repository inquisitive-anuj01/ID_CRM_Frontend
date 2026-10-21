import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://id-crm-backend.vercel.app',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://id-crm-backend.vercel.app',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'https://id-crm-backend.vercel.app',
        ws: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('recharts')) return 'recharts'
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('@dnd-kit')) return 'dnd'
          if (id.includes('@radix-ui')) return 'radix'
        },
      },
    },
  },
})
