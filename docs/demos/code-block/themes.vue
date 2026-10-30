<template>
  <CodeBlock
    :code="code"
    lang="json"
    filename="settings.json"
    :themes="{ light: 'vitesse-light', dark: 'vitesse-dark' }"
    class="max-w-[480px]"
  />
</template>

<script setup lang="ts">
import { CodeBlock } from '@hareui/vue/code-block'

const code = `{
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "files.trimTrailingWhitespace": true
}`
</script>
