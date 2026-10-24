<template>
  <Card
    class="w-full max-w-[480px] rounded-2xl"
    :ui="{ header: 'flex-row items-center justify-between' }"
  >
    <template #header>
      <h3 class="text-base font-medium text-foreground">Class Attendance</h3>
      <ChartLegend :series="series" />
    </template>
    <RadarChart
      :data="data"
      index="category"
      :series="series"
      :fill-opacity="0.1"
      :height="300"
      aria-label="Class attendance by weekday"
    />
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { ChartLegend, RadarChart } from '@hareui/vue/charts'

const data = [
  { category: 'Mon', yoga: 42, spin: 31, boxing: 18 },
  { category: 'Tue', yoga: 35, spin: 38, boxing: 24 },
  { category: 'Wed', yoga: 48, spin: 29, boxing: 21 },
  { category: 'Thu', yoga: 39, spin: 44, boxing: 27 },
  { category: 'Fri', yoga: 30, spin: 36, boxing: 33 },
  { category: 'Sat', yoga: 55, spin: 47, boxing: 26 },
]

const series = {
  yoga: { name: 'Yoga', color: 'var(--chart-4)' },
  spin: { name: 'Spin', color: 'var(--chart-3)' },
  boxing: { name: 'Boxing', color: 'var(--chart-1)' },
}
</script>
