import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Essential for Android WebView local asset packaging
  server: {
    port: 3000,
    host: true
  }
})
