<template>
  <ChartTooltipContent indicator="line" class="min-w-44">
    <ChartTooltipHeader>Build #318</ChartTooltipHeader>
    <ChartTooltipItem v-for="step in steps" :key="step.name">
      <ChartTooltipIndicator :color="step.color" />
      <ChartTooltipLabel>{{ step.name }}</ChartTooltipLabel>
      <ChartTooltipValue>{{ step.time }}</ChartTooltipValue>
    </ChartTooltipItem>
  </ChartTooltipContent>
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

const steps = [
  { name: 'Install', color: 'var(--chart-1)', time: '22s' },
  { name: 'Compile', color: 'var(--chart-2)', time: '48s' },
  { name: 'Tests', color: 'var(--chart-4)', time: '1m 12s' },
  { name: 'Deploy', color: 'var(--chart-5)', time: '35s' },
]
</script>
