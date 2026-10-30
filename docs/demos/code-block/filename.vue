<template>
  <CodeBlock
    :code="code"
    lang="ts"
    filename="vite.config.ts"
    :icon="FileIcon"
    class="max-w-[480px]"
  />
</template>

<script setup lang="ts">
import { CodeBlock } from '@hareui/vue/code-block'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const FileIcon = () => h(Icon, { icon: 'gravity-ui:file-code' })

const code = `import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  server: { port: 4173 },
})`
</script>
