<template>
  <MetricGroup stacked class="w-full max-w-64">
    <Metric
      v-for="item in items"
      :key="item.title"
      :title="item.title"
      :value="item.value"
      :format="item.format"
      :trend="item.trend"
    />
  </MetricGroup>
</template>

<script setup lang="ts">
import type { MetricProps } from '@hareui/vue'
import { Metric, MetricGroup } from '@hareui/vue'

const items: Pick<MetricProps, 'title' | 'value' | 'format' | 'trend'>[] = [
  { title: 'Deploys', value: 128, trend: { label: '+14' } },
  {
    title: 'Success Rate',
    value: 0.976,
    format: { format: 'percent', maximumFractionDigits: 1 },
    trend: { label: '-0.8%', trend: 'down' },
  },
  { title: 'Open Pull Requests', value: 23, trend: { label: '0', trend: 'neutral' } },
]
</script>
