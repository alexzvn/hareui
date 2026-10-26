<template>
  <Card
    class="w-full max-w-[360px] rounded-2xl"
    title="How the Team Commutes"
    :ui="{ title: 'text-base', content: 'items-center gap-3' }"
  >
    <PieChart :height="220" aria-label="How the team commutes">
      <ChartPie :data="data" data-key="people" name-key="mode" :outer-radius="90">
        <ChartCell v-for="color in colors" :key="color" :fill="color" />
      </ChartPie>
      <ChartTooltip />
    </PieChart>
    <ChartLegend :data="data" index="mode" :colors="colors" />
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { ChartCell, ChartLegend, ChartPie, ChartTooltip, PieChart } from '@hareui/vue/charts'

const data = [
  { mode: 'Bike', people: 41 },
  { mode: 'Train', people: 27 },
  { mode: 'Bus', people: 18 },
  { mode: 'Car', people: 14 },
]

const colors = ['var(--chart-4)', 'var(--chart-3)', 'var(--chart-2)', 'var(--chart-1)']
</script>
