<script setup lang="ts">
import { Card } from '@hareui/vue'
import { RadialChart } from '@hareui/vue/charts'

const budget = 3000
const data = [
  { category: 'Rent', spent: 1200, fill: 'var(--chart-4)' },
  { category: 'Groceries', spent: 540, fill: 'var(--chart-3)' },
  { category: 'Transport', spent: 260, fill: 'var(--chart-2)' },
]

const spent = data.reduce((sum, item) => sum + item.spent, 0)

function formatValue(value: number) {
  return `$${value.toLocaleString()}`
}

const legend = { position: 'right' as const, showValue: true }
</script>

<template>
  <Card
    class="w-full max-w-[400px] rounded-2xl"
    title="Monthly Budget"
    :description="`${formatValue(spent)} of ${formatValue(budget)} spent`"
    :ui="{ title: 'text-base', description: 'text-xs' }"
  >
    <RadialChart
      :data="data"
      index="category"
      :height="180"
      inner-radius="40%"
      outer-radius="100%"
      :value-formatter="formatValue"
      :legend="legend"
      :ui="{ legend: 'flex-1' }"
      aria-label="Monthly spending by category"
    >
      <template #center="{ total }">
        <span class="text-xl font-bold text-foreground">{{ formatValue(total) }}</span>
        <span class="text-xs text-muted">spent</span>
      </template>
    </RadialChart>
  </Card>
</template>
