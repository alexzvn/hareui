<template>
  <Card
    class="w-full max-w-[360px] rounded-2xl"
    title="Tickets by Channel"
    :ui="{ title: 'text-base' }"
  >
    <PieChart
      :data="data"
      index="channel"
      donut
      :height="220"
      :value-formatter="formatValue"
      :legend="{ showValue: true }"
      aria-label="Support tickets by channel"
    />
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { PieChart } from '@hareui/vue/charts'

const data = [
  { channel: 'Email', tickets: 3840, fill: 'var(--chart-4)' },
  { channel: 'Chat', tickets: 2610, fill: 'var(--chart-3)' },
  { channel: 'Phone', tickets: 1250, fill: 'var(--chart-2)' },
  { channel: 'Forum', tickets: 960, fill: 'var(--chart-1)' },
]

function formatValue(value: number) {
  return value.toLocaleString()
}
</script>
