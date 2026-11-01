<template>
  <Widget class="w-full max-w-[520px]" title="Greenhouse Humidity" description="Today">
    <AreaChart
      :data="data"
      index="time"
      :series="series"
      aria-label="Greenhouse humidity through the day"
      :height="180"
    />
    <template #footer>
      <span class="text-xs text-muted">Sensor read every 2 hours</span>
      <Button size="sm" variant="tertiary" class="ms-auto">Export</Button>
    </template>
  </Widget>
</template>

<script setup lang="ts">
import { Button, Widget } from '@hareui/vue'
import { AreaChart } from '@hareui/vue/charts'

const data = [
  { time: '6am', humidity: 82 },
  { time: '8am', humidity: 78 },
  { time: '10am', humidity: 71 },
  { time: '12pm', humidity: 64 },
  { time: '2pm', humidity: 61 },
  { time: '4pm', humidity: 66 },
  { time: '6pm', humidity: 73 },
]

const series = {
  humidity: { name: 'Humidity', valueFormatter: (value: number) => `${value}%` },
}
</script>
