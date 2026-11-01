<template>
  <MetricGroup stacked="md" class="w-full max-w-[900px]">
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
  {
    title: 'Revenue',
    value: 48250,
    format: { format: 'currency', currency: 'USD' },
    trend: { label: '+12.4%' },
  },
  { title: 'Orders', value: 1284, trend: { label: '+3.8%' } },
  {
    title: 'Refund rate',
    value: 0.018,
    format: { format: 'percent', maximumFractionDigits: 1 },
    trend: { label: '-0.2%', trend: 'down' },
  },
]
</script>
