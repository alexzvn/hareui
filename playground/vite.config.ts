import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: { '@hareui/vue': fileURLToPath(new URL('../packages/vue/src/index.ts', import.meta.url)) },
  },
  server: { port: 5173, strictPort: true },
})
