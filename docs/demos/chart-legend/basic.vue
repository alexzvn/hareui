<template>
  <Card
    class="w-full max-w-[520px] rounded-2xl"
    :ui="{ header: 'flex-row flex-wrap items-center justify-between gap-2' }"
  >
    <template #header>
      <h3 class="text-base font-medium text-foreground">Support Tickets</h3>
      <ChartLegend :series="series" />
    </template>
    <BarChart
      :data="data"
      index="day"
      :series="series"
      stacked
      aria-label="Support tickets by channel"
      :height="220"
    />
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { BarChart, ChartLegend } from '@hareui/vue/charts'

const data = [
  { day: 'Mon', email: 42, chat: 64, phone: 18 },
  { day: 'Tue', email: 38, chat: 71, phone: 22 },
  { day: 'Wed', email: 45, chat: 58, phone: 16 },
  { day: 'Thu', email: 51, chat: 66, phone: 20 },
  { day: 'Fri', email: 36, chat: 80, phone: 25 },
]

const series = { email: { name: 'Email' }, chat: { name: 'Live chat' }, phone: { name: 'Phone' } }
</script>
