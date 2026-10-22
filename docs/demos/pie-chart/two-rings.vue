<script setup lang="ts">
import { Card } from '@hareui/vue'
import { ChartCell, ChartLegend, ChartPie, ChartTooltip, PieChart } from '@hareui/vue/charts'

const colors = ['var(--chart-4)', 'var(--chart-3)', 'var(--chart-2)', 'var(--chart-1)']

const previous = [
  { season: 'Spring', label: 'Spring 2024', rainfall: 210 },
  { season: 'Summer', label: 'Summer 2024', rainfall: 140 },
  { season: 'Autumn', label: 'Autumn 2024', rainfall: 260 },
  { season: 'Winter', label: 'Winter 2024', rainfall: 190 },
]

const current = [
  { season: 'Spring', label: 'Spring 2025', rainfall: 240 },
  { season: 'Summer', label: 'Summer 2025', rainfall: 110 },
  { season: 'Autumn', label: 'Autumn 2025', rainfall: 300 },
  { season: 'Winter', label: 'Winter 2025', rainfall: 220 },
]

function formatValue(value: number | string) {
  return `${value} mm`
}
</script>

<template>
  <Card class="w-full max-w-[400px] rounded-2xl" title="Rainfall by Season" :ui="{ title: 'text-base', content: 'items-center gap-4' }">
    <!-- Two rings with their own rows: the props draw a single pie, so this chart is built from parts. -->
    <PieChart :height="240" aria-label="Rainfall by season, 2024 inside and 2025 outside">
      <ChartPie :data="previous" data-key="rainfall" name-key="label" inner-radius="34%" outer-radius="46%" :corner-radius="12" :padding-angle="-20">
        <ChartCell v-for="color in colors" :key="color" :fill="color" />
      </ChartPie>
      <ChartPie :data="current" data-key="rainfall" name-key="label" inner-radius="56%" outer-radius="68%" :corner-radius="12" :padding-angle="-20">
        <ChartCell v-for="color in colors" :key="color" :fill="color" />
      </ChartPie>
      <ChartTooltip :value-formatter="formatValue" />
    </PieChart>
    <ChartLegend :data="current" index="season" :colors="colors" />
    <div class="flex items-center gap-3 text-xs text-muted">
      <div class="flex items-center gap-1.5">
        <span class="size-2.5 rounded-full bg-muted/30" />
        <span>2024 (inner)</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="size-2.5 rounded-full bg-muted" />
        <span>2025 (outer)</span>
      </div>
    </div>
  </Card>
</template>
