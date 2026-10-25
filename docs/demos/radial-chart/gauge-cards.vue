<template>
  <div class="grid w-full max-w-[640px] grid-cols-2 gap-3 lg:grid-cols-4">
    <Card
      v-for="metric in metrics"
      :key="metric.name"
      class="rounded-2xl"
      :title="metric.name"
      :ui="{ header: 'pb-0', title: 'text-xs font-medium text-muted', content: 'items-center' }"
    >
      <RadialChart
        :data="[metric]"
        index="name"
        gauge
        :max="metric.max"
        :width="120"
        :height="120"
        :bar="{ size: 8 }"
        inner-radius="70%"
        outer-radius="90%"
        :value="{
          key: 'used',
          formatter: (value: number) => `${value} of ${metric.max} ${metric.unit}`,
        }"
        :aria-label="`${metric.name} usage`"
      >
        <template #center="{ total }">
          <span class="text-lg font-bold text-foreground"
            >{{ Math.round((total / metric.max) * 100) }}%</span
          >
        </template>
      </RadialChart>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { RadialChart } from '@hareui/vue/charts'

const metrics = [
  { name: 'Memory', used: 12, max: 16, unit: 'GB', fill: 'var(--chart-4)' },
  { name: 'Disk', used: 410, max: 512, unit: 'GB', fill: 'var(--chart-3)' },
  { name: 'Network', used: 220, max: 1000, unit: 'Mbps', fill: 'var(--chart-2)' },
  { name: 'Temperature', used: 88, max: 100, unit: '°C', fill: 'var(--danger)' },
]
</script>
