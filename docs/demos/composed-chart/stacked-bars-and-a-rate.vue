<script setup lang="ts">
import type { ChartComposedSeries } from '@hareui/vue/charts'
import { Card } from '@hareui/vue'
import { ChartLegend, ComposedChart } from '@hareui/vue/charts'

const data = [
  { date: 'Sep 1', email: 120, chat: 210, phone: 64, social: 22, solved: 81 },
  { date: 'Sep 2', email: 135, chat: 236, phone: 71, social: 30, solved: 78 },
  { date: 'Sep 3', email: 98, chat: 184, phone: 52, social: 18, solved: 86 },
  { date: 'Sep 4', email: 162, chat: 305, phone: 88, social: 41, solved: 72 },
  { date: 'Sep 5', email: 171, chat: 342, phone: 95, social: 47, solved: 69 },
  { date: 'Sep 6', email: 74, chat: 128, phone: 31, social: 26, solved: 90 },
  { date: 'Sep 7', email: 61, chat: 112, phone: 24, social: 19, solved: 92 },
  { date: 'Sep 8', email: 143, chat: 268, phone: 79, social: 35, solved: 77 },
  { date: 'Sep 9', email: 152, chat: 281, phone: 83, social: 38, solved: 75 },
  { date: 'Sep 10', email: 129, chat: 247, phone: 70, social: 29, solved: 83 },
]

function formatPercent(value: number | string) {
  return `${value}%`
}

const series = {
  chat: { type: 'bar', name: 'Chat', barSize: 20 },
  email: { type: 'bar', name: 'Email', barSize: 20 },
  phone: { type: 'bar', name: 'Phone', barSize: 20 },
  social: { type: 'bar', name: 'Social', barSize: 20 },
  solved: { type: 'line', name: 'Solved same day', yAxis: 'right', strokeWidth: 1.5, valueFormatter: formatPercent },
} satisfies Record<string, ChartComposedSeries>
const colors = ['var(--chart-4)', 'var(--chart-3)', 'var(--chart-2)', 'var(--chart-1)', 'var(--muted)']
</script>

<template>
  <Card class="w-full max-w-[700px] rounded-2xl" :ui="{ header: 'flex-row flex-wrap items-center justify-between gap-2' }">
    <template #header>
      <h3 class="text-base font-medium text-foreground">Support Tickets</h3>
      <ChartLegend :series="series" :colors="colors" />
    </template>
    <ComposedChart
      :data="data"
      index="date"
      :series="series"
      :colors="colors"
      stacked
      :y-axis-right="{ domain: [0, 100], tickFormatter: formatPercent }"
      :tooltip="{ indicator: 'line' }"
      aria-label="Support tickets by channel and same-day solve rate"
      :height="300"
    />
  </Card>
</template>
