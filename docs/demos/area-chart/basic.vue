<template>
  <Card
    class="w-full max-w-[520px] rounded-2xl"
    title="Rooftop Solar Output"
    description="3,743 kWh this year"
    :ui="{ title: 'text-base', description: 'text-xs' }"
  >
    <AreaChart
      :data="data"
      index="month"
      :series="series"
      aria-label="Monthly rooftop solar output"
      :height="200"
    />
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { AreaChart } from '@hareui/vue/charts'

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

const series = {
  output: { name: 'Output', valueFormatter: (value: number) => `${value} kWh` },
}
</script>
