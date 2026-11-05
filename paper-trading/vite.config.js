import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // /api 요청은 Express 서버로 넘김 (CORS 없이 개발)
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
