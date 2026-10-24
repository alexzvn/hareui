<template>
  <Card
    class="w-full max-w-[620px] rounded-2xl"
    :ui="{ header: 'flex-row flex-wrap items-center justify-between gap-2' }"
  >
    <template #header>
      <h3 class="text-base font-medium text-foreground">Cinema Attendance</h3>
      <ChartLegend :series="series" :colors="colors" />
    </template>
    <ComposedChart
      :data="data"
      index="month"
      :series="series"
      :colors="colors"
      :y-axis="{ tickFormatter: formatCount }"
      :y-axis-right="{ domain: [0, 100], tickFormatter: formatPercent }"
      :tooltip="{ indicator: 'line' }"
      aria-label="Cinema tickets, screenings and occupancy by month"
      :height="280"
    />
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import type { ChartComposedSeries } from '@hareui/vue/charts'
import { ChartLegend, ComposedChart } from '@hareui/vue/charts'

const data = [
  { month: 'Jan', tickets: 6200, screenings: 2400, occupancy: 41 },
  { month: 'Feb', tickets: 7100, screenings: 2350, occupancy: 47 },
  { month: 'Mar', tickets: 6800, screenings: 2500, occupancy: 43 },
  { month: 'Apr', tickets: 8400, screenings: 2600, occupancy: 52 },
  { month: 'May', tickets: 9100, screenings: 2700, occupancy: 55 },
  { month: 'Jun', tickets: 10600, screenings: 2900, occupancy: 61 },
  { month: 'Jul', tickets: 12300, screenings: 3100, occupancy: 68 },
  { month: 'Aug', tickets: 11800, screenings: 3050, occupancy: 66 },
  { month: 'Sep', tickets: 8900, screenings: 2750, occupancy: 53 },
  { month: 'Oct', tickets: 9400, screenings: 2800, occupancy: 56 },
  { month: 'Nov', tickets: 10200, screenings: 2850, occupancy: 59 },
  { month: 'Dec', tickets: 13100, screenings: 3200, occupancy: 72 },
]

const compact = new Intl.NumberFormat('en', { notation: 'compact' })

function formatCount(value: number | string) {
  return compact.format(Number(value))
}

function formatNumber(value: number) {
  return Number(value).toLocaleString('en-US')
}

function formatPercent(value: number | string) {
  return `${value}%`
}

const series = {
  tickets: {
    type: 'area',
    name: 'Tickets',
    fillOpacity: [0.15, 0.02],
    valueFormatter: formatNumber,
  },
  screenings: { type: 'bar', name: 'Screenings', barSize: 14, valueFormatter: formatNumber },
  occupancy: {
    type: 'line',
    name: 'Occupancy',
    yAxis: 'right',
    dot: { r: 3, fill: 'var(--chart-1)', strokeWidth: 0 },
    valueFormatter: formatPercent,
  },
} satisfies Record<string, ChartComposedSeries>
const colors = ['var(--chart-3)', 'var(--chart-5)', 'var(--chart-1)']
</script>
