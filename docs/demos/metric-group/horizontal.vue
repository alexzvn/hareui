<template>
  <MetricGroup class="w-full max-w-[900px]">
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
  { title: 'Page Views', value: 182400, trend: { label: '+9.3%' } },
  { title: 'Visitors', value: 40310, trend: { label: '+2.1%' } },
  {
    title: 'Conversion',
    value: 0.031,
    format: { format: 'percent', maximumFractionDigits: 1 },
    trend: { label: '-0.4%', trend: 'down' },
  },
]
</script>
