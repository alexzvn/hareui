<template>
  <Card
    class="w-full max-w-[460px] rounded-2xl"
    :ui="{ header: 'flex-row items-center justify-between' }"
  >
    <template #header>
      <h3 class="text-base font-medium text-foreground">Player Ratings</h3>
      <ChartLegend :series="series" />
    </template>
    <RadarChart
      :data="data"
      index="category"
      :series="series"
      :dot="{ strokeWidth: 0 }"
      :radius-axis="{ angle: 90, domain: [0, 100] }"
      :height="300"
      aria-label="Player ratings this season and last season"
    />
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { ChartLegend, RadarChart } from '@hareui/vue/charts'

const data = [
  { category: 'Pace', thisSeason: 88, lastSeason: 82 },
  { category: 'Shooting', thisSeason: 79, lastSeason: 84 },
  { category: 'Passing', thisSeason: 71, lastSeason: 63 },
  { category: 'Dribbling', thisSeason: 83, lastSeason: 77 },
  { category: 'Defense', thisSeason: 42, lastSeason: 48 },
  { category: 'Stamina', thisSeason: 76, lastSeason: 70 },
]

const series = {
  thisSeason: { name: 'This season', color: 'var(--chart-4)' },
  lastSeason: { name: 'Last season', color: 'var(--chart-1)' },
}
</script>
