<script setup lang="ts">
import { Card } from '@hareui/vue'
import type { ChartTooltipContentEntry } from '@hareui/vue/charts'
import { ChartLegend, LineChart } from '@hareui/vue/charts'

const data = [
  { day: 'Mon', solar: 8.2, grid: 6.1 },
  { day: 'Tue', solar: 11.4, grid: 4.3 },
  { day: 'Wed', solar: 5.6, grid: 9.8 },
  { day: 'Thu', solar: 9.9, grid: 5.2 },
  { day: 'Fri', solar: 12.7, grid: 3.6 },
  { day: 'Sat', solar: 14.1, grid: 4.9 },
  { day: 'Sun', solar: 10.3, grid: 7.4 },
]

const series = { solar: { name: 'Solar' }, grid: { name: 'Grid' } }

function formatEnergy(value: number | string) {
  return `${value} kWh`
}

function total(payload: ChartTooltipContentEntry[]) {
  return formatEnergy(payload.reduce((sum, entry) => sum + Number(entry.value), 0).toFixed(1))
}
</script>

<template>
  <Card
    class="w-full max-w-[520px] rounded-2xl"
    :ui="{ header: 'flex-row items-center justify-between' }"
  >
    <template #header>
      <h3 class="text-base font-medium text-foreground">Home Energy</h3>
      <ChartLegend :series="series" />
    </template>
    <LineChart
      :data="data"
      index="day"
      :series="series"
      aria-label="Daily home energy from solar and grid"
      :height="200"
      :tooltip="{ indicator: 'line', valueFormatter: formatEnergy }"
    >
      <template #tooltip-footer="{ payload }">
        <div class="mt-1 flex items-center justify-between gap-4 border-t border-separator pt-1.5">
          <span class="text-xs font-medium text-muted">Consumed</span>
          <span class="text-xs font-semibold text-foreground">{{ total(payload) }}</span>
        </div>
      </template>
    </LineChart>
  </Card>
</template>
