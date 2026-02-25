import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Mengarahkan semua request /api dari Frontend (5173) ke Backend (3000) saat di localhost
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})