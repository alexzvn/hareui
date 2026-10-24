<script setup lang="ts">
import { Card } from '@hareui/vue'
import { PieChart } from '@hareui/vue/charts'

const data = [
  { format: 'Books', loans: 1860, fill: 'var(--chart-4)' },
  { format: 'E-books', loans: 940, fill: 'var(--chart-3)' },
  { format: 'Audiobooks', loans: 420, fill: 'var(--chart-2)' },
]

const legend = {
  orientation: 'vertical' as const,
  showValue: true,
  showPercent: true,
  percentFormatter: (percent: number) => `(${Math.round(percent)}%)`,
}

const compactFormat = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })

function compact(value: number) {
  return compactFormat.format(value)
}
</script>

<template>
  <Card class="w-full max-w-[360px] rounded-2xl" title="Library Loans" :ui="{ title: 'text-base', content: 'items-center' }">
    <PieChart :data="data" index="format" donut :width="240" :height="240" :legend="legend" aria-label="Library loans by format">
      <template #center="{ total }">
        <span class="text-3xl font-bold text-foreground">{{ compact(total) }}</span>
        <span class="text-sm text-muted">Loans this month</span>
      </template>
    </PieChart>
  </Card>
</template>
