<script setup lang="ts">
import { Card } from '@hareui/vue'
import { PieChart } from '@hareui/vue/charts'

const data = [
  { mode: 'Bike', people: 41, fill: 'var(--chart-4)' },
  { mode: 'Train', people: 27, fill: 'var(--chart-3)' },
  { mode: 'Bus', people: 18, fill: 'var(--chart-2)' },
  { mode: 'Car', people: 14, fill: 'var(--chart-1)' },
]
</script>

<template>
  <Card class="w-full max-w-[360px] rounded-2xl" title="How the Team Commutes" :ui="{ title: 'text-base' }">
    <PieChart :data="data" index="mode" :outer-radius="90" :height="220" legend aria-label="How the team commutes" />
  </Card>
</template>
