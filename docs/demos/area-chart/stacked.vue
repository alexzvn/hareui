<script setup lang="ts">
import { Card } from '@hareui/vue'
import { AreaChart, ChartLegend } from '@hareui/vue/charts'

const data = [
  { month: 'Jan', paper: 42, plastic: 18, glass: 12, metal: 6 },
  { month: 'Feb', paper: 39, plastic: 17, glass: 11, metal: 5 },
  { month: 'Mar', paper: 45, plastic: 21, glass: 13, metal: 7 },
  { month: 'Apr', paper: 48, plastic: 23, glass: 15, metal: 7 },
  { month: 'May', paper: 46, plastic: 26, glass: 18, metal: 8 },
  { month: 'Jun', paper: 44, plastic: 29, glass: 22, metal: 9 },
  { month: 'Jul', paper: 41, plastic: 31, glass: 25, metal: 9 },
  { month: 'Aug', paper: 40, plastic: 30, glass: 24, metal: 8 },
  { month: 'Sep', paper: 47, plastic: 25, glass: 17, metal: 8 },
  { month: 'Oct', paper: 50, plastic: 22, glass: 14, metal: 7 },
  { month: 'Nov', paper: 53, plastic: 20, glass: 13, metal: 7 },
  { month: 'Dec', paper: 61, plastic: 24, glass: 19, metal: 10 },
]

const series = {
  paper: { name: 'Paper' },
  plastic: { name: 'Plastic' },
  glass: { name: 'Glass' },
  metal: { name: 'Metal' },
}
const colors = ['var(--chart-5)', 'var(--chart-3)', 'var(--chart-2)', 'var(--chart-1)']

function formatTonnes(value: number) {
  return `${value} t`
}
</script>

<template>
  <Card
    class="w-full max-w-[600px] rounded-2xl"
    :ui="{ header: 'flex-row flex-wrap items-center justify-between gap-2' }"
  >
    <template #header>
      <h3 class="text-base font-medium text-foreground">Recycling Collected</h3>
      <ChartLegend :series="series" :colors="colors" />
    </template>
    <AreaChart
      :data="data"
      index="month"
      :series="series"
      :colors="colors"
      stacked
      :fill-opacity="[0.4, 0.1]"
      aria-label="Recycling collected by material"
      :height="240"
      :value-formatter="formatTonnes"
      :tooltip="{ indicator: 'line' }"
    />
  </Card>
</template>
