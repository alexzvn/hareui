<script setup lang="ts">
import { Card } from '@hareui/vue'
import { ChartLegend, LineChart } from '@hareui/vue/charts'

const data = [
  { time: '06:00', northPier: 120, oldTown: 60 },
  { time: '08:00', northPier: 410, oldTown: 220 },
  { time: '10:00', northPier: 260, oldTown: 310 },
  { time: '12:00', northPier: 230, oldTown: 380 },
  { time: '14:00', northPier: 280, oldTown: 360 },
  { time: '16:00', northPier: 350, oldTown: 290 },
  { time: '18:00', northPier: 470, oldTown: 240 },
  { time: '20:00', northPier: 190, oldTown: 150 },
]

const series = { northPier: { name: 'North Pier' }, oldTown: { name: 'Old Town' } }
</script>

<template>
  <Card
    class="w-full max-w-[520px] rounded-2xl"
    :ui="{ header: 'flex-row items-center justify-between' }"
  >
    <template #header>
      <h3 class="text-base font-medium text-foreground">Ferry Passengers</h3>
      <ChartLegend :series="series" />
    </template>
    <div class="flex flex-col gap-4">
      <div class="flex flex-col">
        <span class="text-lg font-semibold text-foreground">4,330</span>
        <span class="text-xs text-muted">Boardings today</span>
      </div>
      <LineChart
        :data="data"
        index="time"
        :series="series"
        curve="linear"
        :y-axis="{ ticks: [0, 150, 300, 450] }"
        aria-label="Ferry passengers by pier through the day"
        :height="180"
      />
    </div>
  </Card>
</template>
