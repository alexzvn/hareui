<template>
  <div class="grid items-start gap-4 sm:grid-cols-2">
    <ChartTooltipContent label="Week 14" :payload="workouts" />
    <ChartTooltipContent indicator="line" label="Summer 2025" :payload="bookings" />
  </div>
</template>

<script setup lang="ts">
import { ChartTooltipContent } from '@hareui/vue/charts'

// Line series pass `color`, bar series often pass only `fill`.
const workouts = [
  { dataKey: 'cycling', name: 'Cycling', color: 'var(--chart-2)', value: 118 },
  { dataKey: 'running', name: 'Running', color: 'var(--chart-4)', value: 42 },
]

const bookings = [
  { dataKey: 'hotels', name: 'Hotels', fill: 'var(--chart-1)', value: 2480 },
  { dataKey: 'flights', name: 'Flights', fill: 'var(--chart-4)', value: 3120 },
  { dataKey: 'cars', name: 'Car rentals', fill: 'var(--chart-5)', value: 640 },
]
</script>
