<template>
  <Widget class="w-full max-w-[520px]" title="Bakery Orders" description="Last 7 days">
    <BarChart
      :data="data"
      index="day"
      :series="series"
      aria-label="Bakery orders per day"
      :height="200"
    />
  </Widget>
</template>

<script setup lang="ts">
import { Widget } from '@hareui/vue'
import { BarChart } from '@hareui/vue/charts'

const data = [
  { day: 'Mon', orders: 84 },
  { day: 'Tue', orders: 92 },
  { day: 'Wed', orders: 77 },
  { day: 'Thu', orders: 105 },
  { day: 'Fri', orders: 138 },
  { day: 'Sat', orders: 171 },
  { day: 'Sun', orders: 126 },
]

const series = { orders: { name: 'Orders' } }
</script>
