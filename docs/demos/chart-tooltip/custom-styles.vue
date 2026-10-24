<script setup lang="ts">
import { ChartTooltipContent } from '@hareui/vue/charts'

const payload = [
  { name: 'Desktop', color: 'var(--chart-3)', value: 1840 },
  { name: 'Mobile', color: 'var(--chart-1)', value: 960 },
]
</script>

<template>
  <ChartTooltipContent
    label="Week 12"
    :payload="payload"
    class="min-w-48 rounded-2xl"
    :ui="{ header: 'text-foreground', value: 'text-accent', indicator: 'rounded-sm' }"
  />
</template>
