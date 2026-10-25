<template>
  <Card
    class="w-full max-w-[360px] rounded-2xl"
    title="Cloud Backup"
    :description="`${stored} GB of 200 GB plan`"
    :ui="{ title: 'text-base', description: 'text-xs', content: 'items-center' }"
  >
    <PieChart
      :data="data"
      index="kind"
      donut
      :width="220"
      :height="220"
      :value="{ formatter: formatValue }"
      :legend="{ showValue: true }"
      aria-label="Cloud backup by file kind"
    >
      <template #center="{ total }">
        <span class="text-2xl font-bold text-foreground">{{ total }}</span>
        <span class="text-xs text-muted">GB backed up</span>
      </template>
    </PieChart>
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { PieChart } from '@hareui/vue/charts'

const data = [
  { kind: 'Photos', size: 61, fill: 'var(--chart-4)' },
  { kind: 'Videos', size: 38, fill: 'var(--chart-3)' },
  { kind: 'Screenshots', size: 9, fill: 'var(--chart-2)' },
  { kind: 'Other', size: 4, fill: 'var(--chart-1)' },
]

const stored = data.reduce((sum, item) => sum + item.size, 0)

const formatValue = (value: number) => {
  return `${value} GB`
}
</script>
