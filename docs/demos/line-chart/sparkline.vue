<script setup lang="ts">
import { LineChart } from '@hareui/vue/charts'

function points(values: number[]) {
  return values.map((value, index) => ({ day: `Oct ${index + 1}`, value }))
}

const sparklines = [
  {
    label: 'CPU',
    value: '38%',
    color: 'var(--chart-3)',
    format: (value: number) => `${value}%`,
    data: points([31, 44, 36, 52, 40, 35, 48, 42, 39, 45, 37, 38]),
  },
  {
    label: 'Memory',
    value: '6.2 GB',
    color: 'var(--warning)',
    format: (value: number) => `${value} GB`,
    data: points([4.1, 4.3, 4.6, 4.8, 5.0, 5.1, 5.4, 5.6, 5.7, 5.9, 6.0, 6.2]),
  },
  {
    label: 'Errors',
    value: '3/min',
    color: 'var(--danger)',
    format: (value: number) => `${value}/min`,
    data: points([9, 7, 8, 6, 7, 5, 6, 4, 5, 3, 4, 3]),
  },
]
</script>

<template>
  <div class="flex w-full items-center gap-6">
    <div v-for="item in sparklines" :key="item.label" class="flex min-w-0 flex-1 flex-col gap-1">
      <span class="text-xs text-muted"
        >{{ item.label }} · <span class="font-medium text-foreground">{{ item.value }}</span></span
      >
      <div class="w-full max-w-[120px]">
        <LineChart
          :data="item.data"
          index="day"
          :series="{ value: { name: item.label, color: item.color } }"
          sparkline
          :value-formatter="item.format"
          :tooltip="{ cursor: false, panel: false }"
          :aria-label="`${item.label} trend`"
          :height="40"
        />
      </div>
    </div>
  </div>
</template>
