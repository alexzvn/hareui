<template>
  <Card
    class="w-full max-w-[520px] rounded-2xl"
    :ui="{ header: 'flex-row items-center justify-between' }"
  >
    <template #header>
      <h3 class="text-base font-medium text-foreground">Power Use vs Budget</h3>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1.5">
          <span class="size-3 rounded-full" style="background-color: var(--chart-3)" />
          <span class="text-xs text-muted">Used</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="h-0 w-3 border-t-2 border-dashed" style="border-color: var(--chart-1)" />
          <span class="text-xs text-muted">Budget</span>
        </div>
      </div>
    </template>
    <LineChart
      :data="data"
      index="week"
      :series="series"
      aria-label="Weekly power use against budget"
      :height="200"
      :value-formatter="formatUsage"
    />
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { LineChart } from '@hareui/vue/charts'

const data = [
  { week: 'W1', used: 310, budget: 300 },
  { week: 'W2', used: 285, budget: 300 },
  { week: 'W3', used: 342, budget: 300 },
  { week: 'W4', used: 298, budget: 280 },
  { week: 'W5', used: 264, budget: 280 },
  { week: 'W6', used: 251, budget: 260 },
  { week: 'W7', used: 238, budget: 260 },
  { week: 'W8', used: 270, budget: 240 },
  { week: 'W9', used: 226, budget: 240 },
  { week: 'W10', used: 212, budget: 220 },
]

const series = [
  {
    key: 'budget',
    name: 'Budget',
    color: 'var(--chart-1)',
    strokeDasharray: '5 5',
    curve: 'stepAfter',
  },
  { key: 'used', name: 'Used', color: 'var(--chart-3)' },
] as const

const formatUsage = (value: number) => {
  return `${value} kWh`
}
</script>
