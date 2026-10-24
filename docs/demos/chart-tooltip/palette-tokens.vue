<template>
  <figure class="flex flex-col items-center gap-3">
    <ChartTooltipContent>
      <ChartTooltipHeader>Q3 sales by region</ChartTooltipHeader>
      <ChartTooltipItem v-for="region in regions" :key="region.name">
        <ChartTooltipIndicator :color="`var(${region.token})`" />
        <ChartTooltipLabel>{{ region.name }}</ChartTooltipLabel>
        <ChartTooltipValue>{{ region.value }}</ChartTooltipValue>
      </ChartTooltipItem>
    </ChartTooltipContent>
    <figcaption class="text-xs text-muted">
      <code>--chart-5</code> (+24%) down to <code>--chart-1</code> (−24%) lightness
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import {
  ChartTooltipContent,
  ChartTooltipHeader,
  ChartTooltipIndicator,
  ChartTooltipItem,
  ChartTooltipLabel,
  ChartTooltipValue,
} from '@hareui/vue/charts'

const regions = [
  { name: 'Central', token: '--chart-5', value: '$1,980' },
  { name: 'West', token: '--chart-4', value: '$2,750' },
  { name: 'South', token: '--chart-3', value: '$3,410' },
  { name: 'East', token: '--chart-2', value: '$3,960' },
  { name: 'North', token: '--chart-1', value: '$4,820' },
]
</script>
