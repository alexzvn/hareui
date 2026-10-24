<template>
  <Card
    class="w-full max-w-[560px] rounded-2xl"
    :ui="{ header: 'flex-row flex-wrap items-center justify-between gap-2' }"
  >
    <template #header>
      <h3 class="text-base font-medium text-foreground">Reservoir Level</h3>
      <ChartLegend :series="series" />
    </template>
    <ComposedChart
      :data="data"
      index="month"
      :series="series"
      :y-axis="{ domain: [0, 100] }"
      :value-formatter="formatPercent"
      aria-label="Reservoir level against the 20-year average"
      :height="260"
    />
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import type { ChartComposedSeries } from '@hareui/vue/charts'
import { ChartLegend, ComposedChart } from '@hareui/vue/charts'

const data = [
  { month: 'Jan', level: 78, average: 72 },
  { month: 'Feb', level: 84, average: 76 },
  { month: 'Mar', level: 88, average: 81 },
  { month: 'Apr', level: 85, average: 83 },
  { month: 'May', level: 76, average: 79 },
  { month: 'Jun', level: 64, average: 72 },
  { month: 'Jul', level: 51, average: 63 },
  { month: 'Aug', level: 43, average: 55 },
  { month: 'Sep', level: 39, average: 50 },
  { month: 'Oct', level: 47, average: 52 },
  { month: 'Nov', level: 58, average: 60 },
  { month: 'Dec', level: 69, average: 67 },
]

const series = {
  level: { type: 'area', name: 'This year', fillOpacity: [0.25, 0.02] },
  average: { type: 'line', name: '20-year average', strokeDasharray: '6 3' },
} satisfies Record<string, ChartComposedSeries>

const formatPercent = (value: number) => {
  return `${value}%`
}
</script>
