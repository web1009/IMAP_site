import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8020',
        changeOrigin: true
      },
      // IMAP 본문 이미지 (admin 백엔드 업로드 파일)
      '/uploads': {
        target: 'http://localhost:8022',
        changeOrigin: true
      }
    }
  },
})
