<template>
  <Card
    class="w-full max-w-[560px] rounded-2xl"
    title="New Signups"
    :ui="{ title: 'text-base', content: 'flex flex-col gap-4' }"
  >
    <ChartLegend :series="series" :ui="{ base: 'gap-6' }">
      <template #item="{ item }">
        <span class="h-8 w-1 shrink-0 rounded-full" :style="{ backgroundColor: item.color }" />
        <span class="flex flex-col">
          <span class="text-xs text-muted">{{ item.name }}</span>
          <span class="flex items-baseline gap-1.5">
            <span class="text-base font-semibold text-foreground tabular-nums">{{
              total(item.key)
            }}</span>
            <span class="text-xs text-success tabular-nums">+{{ change(item.key) }}%</span>
          </span>
        </span>
      </template>
    </ChartLegend>
    <AreaChart
      :data="data"
      index="week"
      :series="series"
      aria-label="New signups by plan"
      :height="180"
    />
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { AreaChart, ChartLegend } from '@hareui/vue/charts'

const data = [
  { week: 'W1', starter: 120, team: 64, business: 18 },
  { week: 'W2', starter: 134, team: 70, business: 21 },
  { week: 'W3', starter: 128, team: 81, business: 19 },
  { week: 'W4', starter: 152, team: 88, business: 26 },
  { week: 'W5', starter: 149, team: 97, business: 31 },
  { week: 'W6', starter: 171, team: 104, business: 29 },
]

const series = {
  starter: { name: 'Starter' },
  team: { name: 'Team' },
  business: { name: 'Business' },
} as const

type Plan = keyof typeof series

const total = (key: string) => {
  return data.reduce((sum, row) => sum + row[key as Plan], 0)
}

const change = (key: string) => {
  const first = data[0]![key as Plan]
  const last = data.at(-1)![key as Plan]

  return Math.round(((last - first) / first) * 100)
}
</script>
