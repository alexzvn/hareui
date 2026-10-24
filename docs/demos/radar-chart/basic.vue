<script setup lang="ts">
import { Card } from '@hareui/vue'
import { RadarChart } from '@hareui/vue/charts'

const data = [
  { category: 'Range', score: 81 },
  { category: 'Comfort', score: 68 },
  { category: 'Safety', score: 90 },
  { category: 'Portability', score: 57 },
  { category: 'Build', score: 84 },
  { category: 'Value', score: 73 },
]

const series = { score: { name: 'Score' } }
</script>

<template>
  <Card
    class="w-full max-w-[420px] rounded-2xl"
    title="Scooter Review"
    :ui="{ title: 'text-base' }"
  >
    <RadarChart
      :data="data"
      index="category"
      :series="series"
      :dot="{ strokeWidth: 0 }"
      :height="280"
      aria-label="Scooter review scores"
    />
  </Card>
</template>
