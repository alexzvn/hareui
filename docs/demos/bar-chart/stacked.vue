<script setup lang="ts">
import { Card } from '@hareui/vue'
import { BarChart, ChartLegend } from '@hareui/vue/charts'

const data = [
  { quarter: 'Q1', compute: 3200, storage: 1400, network: 600 },
  { quarter: 'Q2', compute: 3900, storage: 1650, network: 820 },
  { quarter: 'Q3', compute: 3500, storage: 1900, network: 760 },
  { quarter: 'Q4', compute: 4600, storage: 2150, network: 1040 },
]

const series = { compute: { name: 'Compute' }, storage: { name: 'Storage' }, network: { name: 'Network' } }
const colors = ['var(--chart-2)', 'var(--chart-3)', 'var(--chart-5)']

function formatTick(value: number | string) {
  return `$${(Number(value) / 1000).toFixed(0)}k`
}

function formatValue(value: number | string) {
  return `$${Number(value).toLocaleString()}`
}
</script>

<template>
  <Card class="w-full max-w-[480px] rounded-2xl" :ui="{ header: 'flex-row flex-wrap items-center justify-between gap-2' }">
    <template #header>
      <h3 class="text-base font-medium text-foreground">Cloud Spend</h3>
      <ChartLegend :series="series" :colors="colors" />
    </template>
    <BarChart
      :data="data"
      index="quarter"
      :series="series"
      :colors="colors"
      stacked
      :bar-size="32"
      aria-label="Quarterly cloud spend by service"
      :height="220"
      :y-axis="{ tickFormatter: formatTick }"
      :tooltip="{ indicator: 'line', valueFormatter: formatValue }"
    />
  </Card>
</template>
