<template>
  <Card
    class="w-full max-w-[520px] rounded-2xl"
    title="Sleep This Week"
    description="Average 7.2 h per night"
    :ui="{ title: 'text-base', description: 'text-xs' }"
  >
    <LineChart
      :data="data"
      index="day"
      :series="series"
      aria-label="Hours of sleep per night this week"
      :height="200"
      :value-formatter="formatHours"
      :y-axis="{ domain: [5, 9] }"
    />
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { LineChart } from '@hareui/vue/charts'

const data = [
  { day: 'Mon', sleep: 6.8 },
  { day: 'Tue', sleep: 7.2 },
  { day: 'Wed', sleep: 6.1 },
  { day: 'Thu', sleep: 7.6 },
  { day: 'Fri', sleep: 6.4 },
  { day: 'Sat', sleep: 8.3 },
  { day: 'Sun', sleep: 8.0 },
]

const series = {
  sleep: {
    name: 'Sleep',
    dot: { r: 3, fill: 'var(--chart-3)', strokeWidth: 0 },
    activeDot: { r: 5 },
  },
}

function formatHours(value: number) {
  return `${value} h`
}
</script>
