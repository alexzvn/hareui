<template>
  <Card
    class="w-full max-w-[520px] rounded-2xl"
    title="Rooftop Solar Output"
    description="3,743 kWh this year"
    :ui="{ title: 'text-base', description: 'text-xs' }"
  >
    <AreaChart :data="data" aria-label="Monthly rooftop solar output" :height="200">
      <defs>
        <linearGradient id="solar-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="var(--chart-3)" stop-opacity="0.2" />
          <stop offset="100%" stop-color="var(--chart-3)" stop-opacity="0.02" />
        </linearGradient>
      </defs>
      <ChartGrid :vertical="false" />
      <ChartXAxis data-key="month" :tick="{ margin: 8 }" />
      <ChartYAxis :width="30" />
      <ChartArea
        data-key="output"
        name="Output"
        type="monotone"
        stroke="var(--chart-3)"
        :stroke-width="2"
        fill="url(#solar-fill)"
      />
      <ChartTooltip :value-formatter="formatValue" />
    </AreaChart>
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import {
  AreaChart,
  ChartArea,
  ChartGrid,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
} from '@hareui/vue/charts'

const data = [
  { month: 'Jan', output: 142 },
  { month: 'Feb', output: 196 },
  { month: 'Mar', output: 318 },
  { month: 'Apr', output: 421 },
  { month: 'May', output: 512 },
  { month: 'Jun', output: 548 },
  { month: 'Jul', output: 571 },
  { month: 'Aug', output: 503 },
  { month: 'Sep', output: 389 },
  { month: 'Oct', output: 264 },
  { month: 'Nov', output: 161 },
  { month: 'Dec', output: 118 },
]

const formatValue = (value: number | string) => {
  return `${value} kWh`
}
</script>
