<template>
  <Card
    class="w-full max-w-[560px] rounded-2xl"
    :ui="{ header: 'flex-row flex-wrap items-center justify-between gap-2' }"
  >
    <template #header>
      <h3 class="text-base font-medium text-foreground">Bike Share Rides</h3>
      <ChartLegend :series="series" :colors="colors" />
    </template>
    <ComposedChart
      :data="data"
      index="week"
      :series="series"
      :colors="colors"
      :y-axis="{
        left: { tick: { formatter: formatCount } },
        right: { domain: [0, 6], tick: { formatter: formatKm } },
      }"
      aria-label="Weekly bike share rides and average distance"
      :height="260"
    />
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import type { ChartComposedSeries } from '@hareui/vue/charts'
import { ChartLegend, ComposedChart } from '@hareui/vue/charts'

const data = [
  { week: 'W1', rides: 3820, distance: 3.1 },
  { week: 'W2', rides: 4150, distance: 3.4 },
  { week: 'W3', rides: 3610, distance: 2.9 },
  { week: 'W4', rides: 4980, distance: 3.8 },
  { week: 'W5', rides: 5420, distance: 4.2 },
  { week: 'W6', rides: 5160, distance: 4.0 },
  { week: 'W7', rides: 6030, distance: 4.6 },
  { week: 'W8', rides: 6410, distance: 4.9 },
  { week: 'W9', rides: 5870, distance: 4.4 },
  { week: 'W10', rides: 6690, distance: 5.2 },
]

const compact = new Intl.NumberFormat('en', { notation: 'compact' })

const formatCount = (value: number | string) => {
  return compact.format(Number(value))
}

const formatNumber = (value: number) => {
  return Number(value).toLocaleString('en-US')
}

const formatKm = (value: number | string) => {
  return `${value} km`
}

const series = {
  rides: { type: 'bar', name: 'Rides', barSize: 16, valueFormatter: formatNumber },
  distance: { type: 'area', name: 'Avg. distance', yAxis: 'right', valueFormatter: formatKm },
} satisfies Record<string, ChartComposedSeries>

const colors = ['var(--chart-3)', 'var(--chart-5)']
</script>
