<template>
  <Card
    class="w-full max-w-[280px] rounded-2xl"
    title="Build Server"
    :ui="{ title: 'text-base', content: 'items-center' }"
  >
    <RadialChart
      :data="data"
      index="metric"
      gauge
      :max="100"
      :width="200"
      :height="200"
      inner-radius="70%"
      outer-radius="90%"
      :value-formatter="formatPercent"
      aria-label="Build server CPU load"
    >
      <template #center="{ total }">
        <span class="text-xs text-muted">CPU load</span>
        <span class="text-xl font-bold text-foreground">{{ formatPercent(total) }}</span>
      </template>
    </RadialChart>
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { RadialChart } from '@hareui/vue/charts'

const data = [{ metric: 'CPU load', percent: 62, fill: 'var(--chart-3)' }]

function formatPercent(value: number) {
  return `${value}%`
}
</script>
