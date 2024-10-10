import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import tailwindCssPrimeUi from 'tailwindcss-primeui'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader(), tailwindCssPrimeUi],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
