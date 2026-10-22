<script setup lang="ts">
import { Card } from '@hareui/vue'
import { ChartLegend, RadarChart } from '@hareui/vue/charts'

const data = [
  { category: 'Economy', hatchback: 92, suv: 61 },
  { category: 'Cargo', hatchback: 54, suv: 89 },
  { category: 'Comfort', hatchback: 70, suv: 86 },
  { category: 'Handling', hatchback: 88, suv: 66 },
  { category: 'Safety', hatchback: 76, suv: 84 },
  { category: 'Price', hatchback: 85, suv: 58 },
]

const series = { hatchback: { name: 'Hatchback' }, suv: { name: 'SUV' } }
</script>

<template>
  <Card class="w-full max-w-[460px] rounded-2xl" :ui="{ header: 'flex-row items-center justify-between' }">
    <template #header>
      <h3 class="text-base font-medium text-foreground">Car Comparison</h3>
      <ChartLegend :series="series" />
    </template>
    <RadarChart :data="data" index="category" :series="series" :dot="{ strokeWidth: 0 }" :height="300" aria-label="Hatchback and SUV ratings" />
  </Card>
</template>
