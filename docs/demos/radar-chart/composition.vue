<script setup lang="ts">
import { Card } from '@hareui/vue'
import {
  ChartPolarAngleAxis,
  ChartPolarGrid,
  ChartRadar,
  ChartTooltip,
  RadarChart,
} from '@hareui/vue/charts'

const data = [
  { category: 'Range', score: 81 },
  { category: 'Comfort', score: 68 },
  { category: 'Safety', score: 90 },
  { category: 'Portability', score: 57 },
  { category: 'Build', score: 84 },
  { category: 'Value', score: 73 },
]
</script>

<template>
  <Card
    class="w-full max-w-[420px] rounded-2xl"
    title="Scooter Review"
    :ui="{ title: 'text-base' }"
  >
    <RadarChart :data="data" :height="280" aria-label="Scooter review scores">
      <ChartPolarGrid />
      <ChartPolarAngleAxis data-key="category" />
      <ChartRadar
        data-key="score"
        name="Score"
        stroke="var(--chart-3)"
        fill="var(--chart-3)"
        :fill-opacity="0.15"
        :stroke-width="2"
        :dot="{ fill: 'var(--chart-3)', strokeWidth: 0 }"
      />
      <ChartTooltip />
    </RadarChart>
  </Card>
</template>
