<template>
  <CodeBlock :code="code" lang="css" line-numbers class="max-w-[480px]" />
</template>

<script setup lang="ts">
import { CodeBlock } from '@hareui/vue/code-block'

const code = `.ticket {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  border-radius: 1rem;
}

.ticket:hover {
  background: var(--surface-secondary);
}`
</script>
