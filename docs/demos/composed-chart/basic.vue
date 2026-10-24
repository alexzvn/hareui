<template>
  <Card
    class="w-full max-w-[560px] rounded-2xl"
    :ui="{ header: 'flex-row flex-wrap items-center justify-between gap-2' }"
  >
    <template #header>
      <h3 class="text-base font-medium text-foreground">Covers &amp; Average Check</h3>
      <ChartLegend :series="series" />
    </template>
    <ComposedChart
      :data="data"
      index="day"
      :series="series"
      :y-axis-right="{ tickFormatter: formatCurrency }"
      aria-label="Covers and average check per day"
      :height="260"
    />
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import type { ChartComposedSeries } from '@hareui/vue/charts'
import { ChartLegend, ComposedChart } from '@hareui/vue/charts'

const data = [
  { day: 'Mon', covers: 86, avgCheck: 31 },
  { day: 'Tue', covers: 74, avgCheck: 29 },
  { day: 'Wed', covers: 98, avgCheck: 33 },
  { day: 'Thu', covers: 121, avgCheck: 36 },
  { day: 'Fri', covers: 168, avgCheck: 42 },
  { day: 'Sat', covers: 194, avgCheck: 45 },
  { day: 'Sun', covers: 142, avgCheck: 38 },
]

function formatCurrency(value: number | string) {
  return `€${value}`
}

const series = {
  covers: { type: 'bar', name: 'Covers', barSize: 20 },
  avgCheck: { type: 'line', name: 'Avg. check', yAxis: 'right', valueFormatter: formatCurrency },
} satisfies Record<string, ChartComposedSeries>
</script>
