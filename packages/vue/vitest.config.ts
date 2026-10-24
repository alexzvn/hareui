import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
import { componentNamesPlugin } from './build/componentNames.ts'

export default defineConfig({
  plugins: [vue(), componentNamesPlugin()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: { environment: 'happy-dom', include: ['test/**/*.spec.ts'] },
})
