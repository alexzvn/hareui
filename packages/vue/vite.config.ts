import { fileURLToPath } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

import { componentNamesPlugin } from './build/componentNames.ts'

export default defineConfig({
  plugins: [vue(), componentNamesPlugin()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    lib: {
      entry: [
        'src/index.ts',
        'src/charts.ts',
        'src/carousel.ts',
        'src/code-block.ts',
        'src/command-palette.ts',
        'src/editor.ts',
        'src/editor-drag-handle.ts',
        'src/map.ts',
        'src/markdown.ts',
        'src/locale/index.ts',
        'src/vite.ts',
      ],
      formats: ['es'],
    },
    emptyOutDir: true,
    cssCodeSplit: false,
    rolldownOptions: {
      external:
        /^(node:\w+|vue|reka-ui|tailwind-variants|tailwind-merge|unplugin-vue-components|defu|@tanstack\/vue-table|@tanstack\/vue-virtual|@internationalized\/date|@number-flow\/vue|d3-[\w-]+|embla-carousel[\w-]*|@tiptap\/[\w-]+|@floating-ui\/dom|fuse\.js|shiki|maplibre-gl|marked)(\/|$)/,
      output: { preserveModules: true, preserveModulesRoot: 'src', entryFileNames: '[name].js' },
    },
  },
})
