<template>
  <Card
    class="w-full max-w-[460px] rounded-2xl"
    title="Storage Used"
    :ui="{ title: 'text-base', content: 'flex flex-row items-center gap-6' }"
  >
    <PieChart
      :data="data"
      index="type"
      donut
      aria-label="Storage used by file type"
      :width="160"
      :height="160"
      :value-formatter="formatSize"
    >
      <template #center>
        <span class="text-xl font-bold text-foreground">{{ used }} GB</span>
        <span class="text-[10px]/3 text-muted">of 256 GB</span>
      </template>
    </PieChart>
    <ChartLegend
      class="flex-1"
      :data="data"
      index="type"
      orientation="vertical"
      show-value
      show-percent
      :value-formatter="formatSize"
    />
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { ChartLegend, PieChart } from '@hareui/vue/charts'

const data = [
  { type: 'Photos', size: 84 },
  { type: 'Videos', size: 61 },
  { type: 'Documents', size: 23 },
  { type: 'Apps', size: 12 },
]

const used = data.reduce((sum, item) => sum + item.size, 0)

const formatSize = (value: number) => {
  return `${value} GB`
}
</script>
