<template>
  <Card
    class="w-full max-w-[480px] rounded-2xl"
    :ui="{ header: 'flex-row flex-wrap items-center justify-between gap-2' }"
  >
    <template #header>
      <h3 class="text-base font-medium text-foreground">Pottery Classes</h3>
      <ChartLegend :series="series" :colors="colors" />
    </template>
    <BarChart
      :data="data"
      index="term"
      :series="series"
      :colors="colors"
      :bar-size="12"
      aria-label="Pottery class enrollments by level and term"
      :height="220"
      :tooltip="{ valueFormatter: formatValue }"
    />
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { BarChart, ChartLegend } from '@hareui/vue/charts'

const data = [
  { term: 'Spring', beginner: 84, intermediate: 52, advanced: 21 },
  { term: 'Summer', beginner: 126, intermediate: 61, advanced: 18 },
  { term: 'Fall', beginner: 97, intermediate: 73, advanced: 34 },
  { term: 'Winter', beginner: 68, intermediate: 58, advanced: 39 },
]

const series = {
  beginner: { name: 'Beginner' },
  intermediate: { name: 'Intermediate' },
  advanced: { name: 'Advanced' },
}

const colors = ['var(--chart-4)', 'var(--chart-3)', 'var(--chart-1)']

const formatValue = (value: number | string) => {
  return `${value} students`
}
</script>
