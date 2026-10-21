import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
import { componentNamesPlugin } from './build/componentNames.ts'

export default defineConfig({
  plugins: [vue(), componentNamesPlugin()],
  test: { environment: 'happy-dom', include: ['test/**/*.spec.ts'] },
})
