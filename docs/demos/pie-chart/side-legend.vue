<script setup lang="ts">
import { Card } from '@hareui/vue'
import { PieChart } from '@hareui/vue/charts'

const data = [
  { size: 'Small', orders: 180, fill: 'var(--chart-4)' },
  { size: 'Medium', orders: 410, fill: 'var(--chart-3)' },
  { size: 'Large', orders: 230, fill: 'var(--chart-2)' },
]

const legend = {
  position: 'right' as const,
  showValue: true,
  showPercent: true,
  percentFormatter: (percent: number) => `(${percent.toFixed(1)}%)`,
}
</script>

<template>
  <Card
    class="w-full max-w-[460px] rounded-2xl"
    title="Cake Orders by Size"
    :ui="{ title: 'text-base' }"
  >
    <PieChart
      :data="data"
      index="size"
      donut
      :height="180"
      :legend="legend"
      :ui="{ legend: 'flex-1' }"
      aria-label="Cake orders by size"
    >
      <template #center="{ total }">
        <span class="text-xl font-bold text-foreground">{{ total.toLocaleString() }}</span>
        <span class="text-[10px]/3 text-muted">Orders</span>
      </template>
    </PieChart>
  </Card>
</template>
