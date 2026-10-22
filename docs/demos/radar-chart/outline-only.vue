<script setup lang="ts">
import { Card } from '@hareui/vue'
import { RadarChart } from '@hareui/vue/charts'

const data = [
  { category: 'Acidity', rating: 7.5 },
  { category: 'Body', rating: 5 },
  { category: 'Sweetness', rating: 8 },
  { category: 'Aroma', rating: 9 },
  { category: 'Bitterness', rating: 3.5 },
  { category: 'Finish', rating: 6.5 },
]

const series = { rating: { name: 'Rating' } }
</script>

<template>
  <Card class="w-full max-w-[420px] rounded-2xl" title="Tasting Notes" :ui="{ title: 'text-base' }">
    <RadarChart
      :data="data"
      index="category"
      :series="series"
      :dot="{ r: 4, strokeWidth: 0 }"
      :fill-opacity="1"
      :height="280"
      :ui="{ radar: 'fill-none' }"
      aria-label="Coffee tasting notes"
    />
  </Card>
</template>
