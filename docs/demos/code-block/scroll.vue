<template>
  <CodeBlock :code="code" lang="ts" line-numbers :highlight="[2]" class="max-w-[480px]" />
</template>

<script setup lang="ts">
import { CodeBlock } from '@hareui/vue/code-block'

const code = `const response = await fetch('/api/weather?city=lisbon&units=metric&days=7&include=hourly,alerts')
const { forecast } = (await response.json()) as { forecast: { day: string; high: number }[] }
console.table(forecast)`
</script>
