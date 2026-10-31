<template>
  <Widget class="w-full max-w-[520px]" title="Bike Rentals" :legend="legend">
    <LineChart
      :data="data"
      index="hour"
      :series="series"
      aria-label="Bike rentals by hour, weekdays against weekends"
      :height="200"
    />
  </Widget>
</template>

<script setup lang="ts">
import type { WidgetLegendItem } from '@hareui/vue'
import { Widget } from '@hareui/vue'
import { LineChart } from '@hareui/vue/charts'

const data = [
  { hour: '6am', weekday: 34, weekend: 8 },
  { hour: '9am', weekday: 112, weekend: 41 },
  { hour: '12pm', weekday: 68, weekend: 96 },
  { hour: '3pm', weekday: 59, weekend: 124 },
  { hour: '6pm', weekday: 131, weekend: 88 },
  { hour: '9pm', weekday: 42, weekend: 37 },
]

const series = {
  weekday: { name: 'Weekdays', color: 'var(--chart-3)' },
  weekend: { name: 'Weekends', color: 'var(--chart-1)' },
}

const legend: WidgetLegendItem[] = [
  { label: 'Weekdays', color: 'var(--chart-3)' },
  { label: 'Weekends', color: 'var(--chart-1)' },
]
</script>
