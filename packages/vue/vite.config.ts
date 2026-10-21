import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { componentNamesPlugin } from './build/componentNames.ts'

export default defineConfig({
  plugins: [vue(), componentNamesPlugin()],
  build: {
    lib: { entry: ['src/index.ts', 'src/vite.ts'], formats: ['es'] },
    emptyOutDir: true,
    cssCodeSplit: false,
    rolldownOptions: {
      external: /^(vue|reka-ui|tailwind-variants|tailwind-merge|unplugin-vue-components|@tanstack\/vue-table|@tanstack\/vue-virtual|@internationalized\/date)(\/|$)/,
      output: { preserveModules: true, preserveModulesRoot: 'src', entryFileNames: '[name].js' },
    },
  },
})
