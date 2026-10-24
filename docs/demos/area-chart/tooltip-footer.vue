<script setup lang="ts">
import { Card } from '@hareui/vue'
import type { ChartTooltipContentEntry } from '@hareui/vue/charts'
import { AreaChart, ChartLegend } from '@hareui/vue/charts'

const data = [
  { week: 'W1', ios: 1840, android: 2310 },
  { week: 'W2', ios: 2120, android: 2540 },
  { week: 'W3', ios: 1960, android: 2880 },
  { week: 'W4', ios: 2610, android: 3120 },
  { week: 'W5', ios: 3380, android: 3650 },
  { week: 'W6', ios: 3150, android: 4020 },
  { week: 'W7', ios: 3720, android: 4410 },
  { week: 'W8', ios: 4090, android: 4280 },
]

const series = { android: { name: 'Android' }, ios: { name: 'iOS' } }

const tooltip = {
  indicator: 'line' as const,
  labelFormatter: (label: number | string) => `Week ${String(label).slice(1)}`,
}

function formatTick(value: number | string) {
  return Number(value) >= 1000 ? `${(Number(value) / 1000).toFixed(0)}k` : `${value}`
}

function formatCount(value: number) {
  return value.toLocaleString()
}

function total(payload: ChartTooltipContentEntry[]) {
  return formatCount(payload.reduce((sum, entry) => sum + Number(entry.value), 0))
}
</script>

<template>
  <Card
    class="w-full max-w-[520px] rounded-2xl"
    :ui="{ header: 'flex-row items-center justify-between' }"
  >
    <template #header>
      <h3 class="text-base font-medium text-foreground">App Installs</h3>
      <ChartLegend :series="series" />
    </template>
    <AreaChart
      :data="data"
      index="week"
      :series="series"
      aria-label="Weekly app installs by store"
      :height="200"
      :value-formatter="formatCount"
      :y-axis="{ tickFormatter: formatTick }"
      :tooltip="tooltip"
    >
      <template #tooltip-footer="{ payload }">
        <div class="mt-1 flex items-center justify-between gap-4 border-t border-separator pt-1.5">
          <span class="text-xs font-medium text-muted">Both stores</span>
          <span class="text-xs font-semibold text-foreground">{{ total(payload) }}</span>
        </div>
      </template>
    </AreaChart>
  </Card>
</template>
