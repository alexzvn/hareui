import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index' },
    emptyOutDir: true,
    cssCodeSplit: false,
    rolldownOptions: {
      external: /^(vue|reka-ui|tailwind-variants|tailwind-merge)(\/|$)/,
      output: { preserveModules: true, preserveModulesRoot: 'src', entryFileNames: '[name].js' },
    },
  },
})
