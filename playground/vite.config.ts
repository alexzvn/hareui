import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: { herouse: fileURLToPath(new URL('../packages/herouse/src/index.ts', import.meta.url)) },
  },
  server: { port: 5173, strictPort: true },
})
