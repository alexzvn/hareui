<template>
  <Card
    class="w-full max-w-[480px] rounded-2xl"
    :ui="{ header: 'flex-row flex-wrap items-center justify-between gap-2' }"
  >
    <template #header>
      <div>
        <h3 class="text-base font-medium text-foreground">Rainfall</h3>
        <p class="text-xs text-muted">Compared with the 10-year average</p>
      </div>
      <ChartLegend :series="series" />
    </template>
    <BarChart
      :data="data"
      index="month"
      :series="series"
      :bar="{ size: 12 }"
      aria-label="Monthly rainfall against the 10-year average"
      :height="200"
      :value-formatter="formatRain"
    />
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { BarChart, ChartLegend } from '@hareui/vue/charts'

const data = [
  { month: 'Mar', thisYear: 62, average: 78 },
  { month: 'Apr', thisYear: 91, average: 64 },
  { month: 'May', thisYear: 47, average: 55 },
  { month: 'Jun', thisYear: 18, average: 31 },
  { month: 'Jul', thisYear: 9, average: 12 },
  { month: 'Aug', thisYear: 24, average: 15 },
]

const series = { thisYear: { name: '2026' }, average: { name: '10-year avg.' } }

const formatRain = (value: number) => {
  return `${value} mm`
}
</script>
