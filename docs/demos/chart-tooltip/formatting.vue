<template>
  <ChartTooltipContent
    :label="27"
    :payload="sleep"
    :label-formatter="toWeek"
    :value-formatter="toHours"
  />
</template>

<script setup lang="ts">
import { ChartTooltipContent } from '@hareui/vue/charts'

// Hours slept per night, averaged over the week
const sleep = [
  { name: 'Deep', color: 'var(--chart-1)', value: 1.75 },
  { name: 'REM', color: 'var(--chart-4)', value: 2.1 },
]

const toHours = (value: number | string) => {
  const minutes = Math.round(Number(value) * 60)
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`
}

const toWeek = (label: number | string) => {
  return `Week ${label}`
}
</script>
