<script setup lang="ts">
import { Card } from '@hareui/vue'
import { ChartLegend, LineChart } from '@hareui/vue/charts'

const data = [
  { hour: '00:00', usEast: 82, euWest: 64, asiaPacific: 118, southAmerica: 141 },
  { hour: '02:00', usEast: 78, euWest: 61, asiaPacific: 126, southAmerica: 136 },
  { hour: '04:00', usEast: 75, euWest: 70, asiaPacific: 134, southAmerica: 129 },
  { hour: '06:00', usEast: 80, euWest: 88, asiaPacific: 122, southAmerica: 132 },
  { hour: '08:00', usEast: 96, euWest: 104, asiaPacific: 110, southAmerica: 145 },
  { hour: '10:00', usEast: 118, euWest: 112, asiaPacific: 98, southAmerica: 158 },
  { hour: '12:00', usEast: 131, euWest: 107, asiaPacific: 92, southAmerica: 166 },
  { hour: '14:00', usEast: 142, euWest: 99, asiaPacific: 95, southAmerica: 171 },
  { hour: '16:00', usEast: 137, euWest: 92, asiaPacific: 104, southAmerica: 162 },
  { hour: '18:00', usEast: 124, euWest: 85, asiaPacific: 115, southAmerica: 154 },
  { hour: '20:00', usEast: 106, euWest: 74, asiaPacific: 121, southAmerica: 149 },
  { hour: '22:00', usEast: 91, euWest: 68, asiaPacific: 119, southAmerica: 143 },
]

const series = {
  usEast: { name: 'US East' },
  euWest: { name: 'EU West' },
  asiaPacific: { name: 'Asia Pacific' },
  southAmerica: { name: 'South America' },
}
const colors = ['var(--chart-5)', 'var(--chart-3)', 'var(--chart-2)', 'var(--chart-1)']

function formatLatency(value: number) {
  return `${value} ms`
}
</script>

<template>
  <Card
    class="w-full max-w-[600px] rounded-2xl"
    :ui="{ header: 'flex-row flex-wrap items-center justify-between gap-2' }"
  >
    <template #header>
      <h3 class="text-base font-medium text-foreground">API Latency by Region</h3>
      <ChartLegend :series="series" :colors="colors" />
    </template>
    <LineChart
      :data="data"
      index="hour"
      :series="series"
      :colors="colors"
      aria-label="API latency by region over the day"
      :height="240"
      :value-formatter="formatLatency"
      :tooltip="{ indicator: 'line' }"
    />
  </Card>
</template>
