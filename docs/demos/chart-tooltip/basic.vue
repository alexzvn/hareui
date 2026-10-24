<template>
  <ChartTooltipContent>
    <ChartTooltipHeader>Saturday</ChartTooltipHeader>
    <ChartTooltipItem>
      <ChartTooltipIndicator color="var(--chart-3)" />
      <ChartTooltipLabel>Croissants</ChartTooltipLabel>
      <ChartTooltipValue>$1,240</ChartTooltipValue>
    </ChartTooltipItem>
    <ChartTooltipItem>
      <ChartTooltipIndicator color="var(--chart-1)" />
      <ChartTooltipLabel>Sourdough</ChartTooltipLabel>
      <ChartTooltipValue>$860</ChartTooltipValue>
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
</script>
