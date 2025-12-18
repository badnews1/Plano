import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Специальные папки должны быть первыми (более специфичные пути)
      '@/components/ui': path.resolve(__dirname, './src/app/components/ui'),
      '@/components/figma': path.resolve(__dirname, './src/app/components/figma'),
      
      // FSD слои (Feature-Sliced Design)
      '@/app': path.resolve(__dirname, './src/app'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/widgets': path.resolve(__dirname, './src/widgets'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/entities': path.resolve(__dirname, './src/entities'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      
      // Базовый алиас @ на директорию src (должен быть последним)
      '@': path.resolve(__dirname, './src'),
    },
  },
})