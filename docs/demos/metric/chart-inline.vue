<template>
  <div class="grid w-full max-w-[800px] grid-cols-1 gap-3 sm:grid-cols-2">
    <Metric
      v-for="metric in metrics"
      :key="metric.title"
      :title="metric.title"
      :value="metric.value"
      :format="metric.format"
      :trend="metric.trend"
      chart-placement="inline"
    >
      <template #chart>
        <AreaChart
          :data="metric.data"
          index="day"
          :series="{ value: { name: metric.title, color: metric.color } }"
          sparkline
          :tooltip="{ cursor: false, panel: false }"
          :aria-label="`${metric.title} over the last 10 days`"
          :height="70"
          :margin="{ top: 4, right: 0, bottom: 0, left: 0 }"
        />
      </template>
    </Metric>
  </div>
</template>

<script setup lang="ts">
import type { MetricProps } from '@hareui/vue'
import { Metric } from '@hareui/vue'
import { AreaChart } from '@hareui/vue/charts'

const toData = (values: number[]) => values.map((value, index) => ({ day: index + 1, value }))

type SparklineMetric = Pick<MetricProps, 'title' | 'value' | 'format' | 'trend'> & {
  color: string
  data: { day: number; value: number }[]
}

const metrics: SparklineMetric[] = [
  {
    title: 'Table Bookings',
    value: 1836,
    trend: { value: '+6.4%' },
    color: 'var(--success)',
    data: toData([140, 152, 148, 166, 171, 163, 180, 188, 184, 196]),
  },
  {
    title: 'Repeat Guests',
    value: 0.314,
    format: { format: 'percent', maximumFractionDigits: 1 },
    trend: { value: '-2.4%', trend: 'down' },
    color: 'var(--danger)',
    data: toData([35.2, 34.8, 35.1, 34.0, 33.6, 33.9, 32.8, 32.1, 31.9, 31.4]),
  },
]
</script>
