<template>
  <Card
    class="w-full max-w-[280px] rounded-2xl"
    title="Build Server"
    :ui="{ title: 'text-base', content: 'items-center' }"
  >
    <RadialChart
      :data="data"
      :width="200"
      :height="200"
      :bar-size="10"
      inner-radius="70%"
      outer-radius="90%"
      :start-angle="225"
      :end-angle="-45"
      aria-label="Build server CPU load"
    >
      <ChartPolarAngleAxis type="number" :domain="[0, 100]" :tick="false" />
      <ChartRadialBar data-key="percent" name-key="metric" background :corner-radius="12" />
      <ChartTooltip :value-formatter="formatPercent" />
      <ChartLabel
        position="center"
        :value="formatPercent(data[0]!.percent)"
        class="fill-foreground text-xl font-bold"
      />
    </RadialChart>
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import {
  ChartLabel,
  ChartPolarAngleAxis,
  ChartRadialBar,
  ChartTooltip,
  RadialChart,
} from '@hareui/vue/charts'

const data = [{ metric: 'CPU load', percent: 62, fill: 'var(--chart-3)' }]

const formatPercent = (value: number | string) => {
  return `${value}%`
}
</script>
