<template>
  <Card class="w-full max-w-[480px] rounded-2xl">
    <template #header>
      <h3 class="text-base font-medium text-foreground">Screen Time</h3>
      <div class="mt-1 text-2xl font-bold text-foreground">
        3h 47m <span class="text-sm font-normal text-muted">daily average</span>
      </div>
    </template>
    <BarChart
      :data="data"
      index="day"
      :series="series"
      :colors="colors"
      layout="vertical"
      stacked
      :bar-size="18"
      :grid="false"
      :x-axis="false"
      legend
      aria-label="Daily screen time by category"
      :height="280"
      :margin="margin"
      :value-formatter="formatMinutes"
      :tooltip="{ indicator: 'line' }"
    />
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { BarChart } from '@hareui/vue/charts'

const data = [
  { day: 'Mon', work: 142, social: 48, video: 35 },
  { day: 'Tue', work: 156, social: 41, video: 28 },
  { day: 'Wed', work: 131, social: 55, video: 46 },
  { day: 'Thu', work: 148, social: 39, video: 31 },
  { day: 'Fri', work: 118, social: 62, video: 74 },
  { day: 'Sat', work: 22, social: 96, video: 128 },
  { day: 'Sun', work: 15, social: 88, video: 141 },
]

const series = { work: { name: 'Work' }, social: { name: 'Social' }, video: { name: 'Video' } }
const colors = ['var(--chart-1)', 'var(--chart-3)', 'var(--chart-5)']

const margin = { top: 0, right: 0, bottom: 0, left: 0 }

function formatMinutes(value: number) {
  return `${value} min`
}
</script>
