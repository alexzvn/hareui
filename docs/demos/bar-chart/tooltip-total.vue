<template>
  <Card
    class="w-full max-w-[480px] rounded-2xl"
    title="Museum Tickets"
    description="Tickets sold by channel"
    :ui="{ title: 'text-base', description: 'text-xs' }"
  >
    <BarChart
      :data="data"
      index="month"
      :series="series"
      :colors="colors"
      :bar="{ size: 10 }"
      aria-label="Museum tickets sold by channel"
      :height="220"
      :y-axis="{ left: { tick: { formatter: formatTick } } }"
      :tooltip="{ valueFormatter: formatCount }"
    >
      <template #tooltip-footer="{ payload }">
        <div class="mt-1 flex items-center justify-between gap-4 border-t border-separator pt-1.5">
          <span class="text-xs font-medium text-muted">All channels</span>
          <span class="text-xs font-semibold text-foreground">{{ total(payload) }}</span>
        </div>
      </template>
    </BarChart>
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import type { ChartTooltipContentEntry } from '@hareui/vue/charts'
import { BarChart } from '@hareui/vue/charts'

const data = [
  { month: 'Apr', desk: 1240, app: 2310, kiosk: 860 },
  { month: 'May', desk: 1480, app: 2790, kiosk: 940 },
  { month: 'Jun', desk: 1920, app: 3460, kiosk: 1310 },
  { month: 'Jul', desk: 2650, app: 4120, kiosk: 1780 },
  { month: 'Aug', desk: 2410, app: 4380, kiosk: 1620 },
]

const series = { app: { name: 'App' }, desk: { name: 'Front desk' }, kiosk: { name: 'Kiosk' } }
const colors = ['var(--chart-3)', 'var(--chart-2)', 'var(--chart-1)']

const formatTick = (value: number | string) => {
  return `${(Number(value) / 1000).toFixed(0)}k`
}

const formatCount = (value: number | string) => {
  return Number(value).toLocaleString()
}

const total = (payload: ChartTooltipContentEntry[]) => {
  return formatCount(payload.reduce((sum, entry) => sum + Number(entry.value), 0))
}
</script>
