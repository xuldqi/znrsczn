import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'vendor-mui'
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react'
            }
            if (id.includes('date-fns')) {
              return 'vendor-dates'
            }
            return 'vendor-misc'
          }
        }
      }
    },
    chunkSizeWarningLimit: 800
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:1337',
        changeOrigin: true
      }
    }
  }
})
