import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          router: ['react-router-dom'],
        },
      },
    },
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    target: 'es2020',
  },
})
