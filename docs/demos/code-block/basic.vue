<template>
  <CodeBlock :code="code" lang="typescript" class="max-w-[480px]" />
</template>

<script setup lang="ts">
import { CodeBlock } from '@hareui/vue/code-block'

const code = `type Order = { items: number[]; coupon?: number }

export const orderTotal = (order: Order) => {
  const sum = order.items.reduce((a, b) => a + b, 0)
  return Math.max(sum - (order.coupon ?? 0), 0)
}`
</script>
