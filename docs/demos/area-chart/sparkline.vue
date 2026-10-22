<script setup lang="ts">
import { AreaChart } from '@hareui/vue/charts'

function points(values: number[]) {
  return values.map((value, index) => ({ day: `Oct ${index + 1}`, value }))
}

const sparklines = [
  { id: 'spark-steps', label: 'Steps', value: '9,412', color: 'var(--chart-3)', format: (value: number) => `${value.toLocaleString('en-US')} steps`, data: points([6200, 8100, 7400, 9800, 5600, 11200, 8700, 9400, 10100, 7800, 9900, 9412]) },
  { id: 'spark-heart', label: 'Resting HR', value: '58 bpm', color: 'var(--danger)', format: (value: number) => `${value} bpm`, data: points([64, 63, 63, 62, 61, 62, 60, 60, 59, 59, 58, 58]) },
  { id: 'spark-sleep', label: 'Sleep', value: '7.4 h', color: 'var(--success)', format: (value: number) => `${value} h`, data: points([6.2, 6.8, 7.1, 6.5, 7.6, 8.1, 6.9, 7.2, 7.8, 7.0, 7.5, 7.4]) },
]
</script>

<template>
  <div class="flex w-full items-center gap-6">
    <div v-for="item in sparklines" :key="item.id" class="flex min-w-0 flex-1 flex-col gap-1">
      <span class="text-xs text-muted">{{ item.label }} · <span class="font-medium text-foreground">{{ item.value }}</span></span>
      <AreaChart
        :data="item.data"
        index="day"
        :series="{ value: { name: item.label, color: item.color } }"
        sparkline
        :value-formatter="item.format"
        :tooltip="{ cursor: false, panel: false }"
        :aria-label="`${item.label} trend`"
        :height="48"
      />
    </div>
  </div>
</template>
