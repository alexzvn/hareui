<template>
  <Card
    class="w-full max-w-[360px] rounded-2xl"
    title="Orders by Drink"
    :ui="{ title: 'text-base' }"
  >
    <PieChart
      :data="data"
      index="drink"
      :outer-radius="90"
      :height="220"
      :value-formatter="formatShare"
      legend
      aria-label="Orders by drink"
    >
      <template #tooltip-footer="{ payload }">
        <div class="mt-1 border-t border-separator pt-1.5 text-xs text-muted">
          {{ payload[0]?.value }} of {{ total }} orders
        </div>
      </template>
    </PieChart>
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { PieChart } from '@hareui/vue/charts'

const data = [
  { drink: 'Latte', orders: 184, fill: 'var(--chart-4)' },
  { drink: 'Espresso', orders: 96, fill: 'var(--chart-3)' },
  { drink: 'Cold brew', orders: 72, fill: 'var(--chart-2)' },
  { drink: 'Mocha', orders: 48, fill: 'var(--chart-1)' },
]

const total = data.reduce((sum, item) => sum + item.orders, 0)

function formatShare(value: number) {
  return `${((value / total) * 100).toFixed(1)}%`
}
</script>
