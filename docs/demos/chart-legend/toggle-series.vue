<script setup lang="ts">
import { Card } from '@hareui/vue'
import { ChartLegend, LineChart } from '@hareui/vue/charts'
import { ref } from 'vue'

const data = [
  { hour: '06:00', harbor: 11, hillside: 8, airport: 10 },
  { hour: '09:00', harbor: 14, hillside: 12, airport: 15 },
  { hour: '12:00', harbor: 18, hillside: 17, airport: 21 },
  { hour: '15:00', harbor: 19, hillside: 18, airport: 23 },
  { hour: '18:00', harbor: 16, hillside: 14, airport: 18 },
  { hour: '21:00', harbor: 13, hillside: 10, airport: 13 },
]

const series = {
  harbor: { name: 'Harbor' },
  hillside: { name: 'Hillside' },
  airport: { name: 'Airport' },
}
const hidden = ref<string[]>(['airport'])

function formatTemperature(value: number) {
  return `${value}°C`
}
</script>

<template>
  <Card
    class="w-full max-w-[520px] rounded-2xl"
    :ui="{ header: 'flex-row flex-wrap items-center justify-between gap-2' }"
  >
    <template #header>
      <h3 class="text-base font-medium text-foreground">Station Temperatures</h3>
      <ChartLegend v-model:hidden="hidden" :series="series" toggleable />
    </template>
    <LineChart
      v-model:hidden="hidden"
      :data="data"
      index="hour"
      :series="series"
      aria-label="Temperature by weather station"
      :height="220"
      :value-formatter="formatTemperature"
    />
  </Card>
</template>
