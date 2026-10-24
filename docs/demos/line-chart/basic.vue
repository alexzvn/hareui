<script setup lang="ts">
import { Card } from '@hareui/vue'
import { ChartLegend, LineChart } from '@hareui/vue/charts'

const data = [
  { month: 'Jan', lisbon: 12, oslo: -4 },
  { month: 'Feb', lisbon: 13, oslo: -3 },
  { month: 'Mar', lisbon: 15, oslo: 1 },
  { month: 'Apr', lisbon: 17, oslo: 6 },
  { month: 'May', lisbon: 20, oslo: 11 },
  { month: 'Jun', lisbon: 23, oslo: 15 },
  { month: 'Jul', lisbon: 26, oslo: 17 },
  { month: 'Aug', lisbon: 26, oslo: 16 },
  { month: 'Sep', lisbon: 24, oslo: 11 },
  { month: 'Oct', lisbon: 20, oslo: 6 },
  { month: 'Nov', lisbon: 16, oslo: 1 },
  { month: 'Dec', lisbon: 13, oslo: -3 },
]

const series = { lisbon: { name: 'Lisbon' }, oslo: { name: 'Oslo' } }

function formatDegrees(value: number) {
  return `${value}°C`
}
</script>

<template>
  <Card
    class="w-full max-w-[520px] rounded-2xl"
    :ui="{ header: 'flex-row items-center justify-between' }"
  >
    <template #header>
      <h3 class="text-base font-medium text-foreground">Average Temperature</h3>
      <ChartLegend :series="series" />
    </template>
    <LineChart
      :data="data"
      index="month"
      :series="series"
      aria-label="Average monthly temperature in Lisbon and Oslo"
      :height="200"
      :value-formatter="formatDegrees"
    />
  </Card>
</template>
