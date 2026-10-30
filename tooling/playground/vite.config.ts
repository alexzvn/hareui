import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    // Exact matches, so `@hareui/vue/<entry>` subpaths don't resolve as paths inside `@hareui/vue`.
    // `@/` is the library's internal alias for packages/vue/src, needed because the playground compiles the library from source.
    alias: [
      {
        find: /^@hareui\/vue\/(charts|carousel|code-block|command-palette|editor)$/,
        replacement: fileURLToPath(new URL('../../packages/vue/src/$1.ts', import.meta.url)),
      },
      {
        find: /^@hareui\/vue$/,
        replacement: fileURLToPath(new URL('../../packages/vue/src/index.ts', import.meta.url)),
      },
      { find: /^@\//, replacement: fileURLToPath(new URL('../../packages/vue/src/', import.meta.url)) },
    ],
  },
  server: { port: 5173, strictPort: true },
})
