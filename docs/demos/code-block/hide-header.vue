<template>
  <CodeBlock :code="code" lang="bash" hide-header class="max-w-[480px]" />
</template>

<script setup lang="ts">
import { CodeBlock } from '@hareui/vue/code-block'

const code = 'git switch -c fix/invoice-rounding'
</script>
