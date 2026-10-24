<template>
  <Card
    class="w-full max-w-[300px] rounded-2xl"
    title="Water Intake"
    :ui="{ title: 'text-base', content: 'items-center' }"
  >
    <RadialChart
      :data="data"
      index="drink"
      :max="goal"
      :width="200"
      :height="200"
      :bar-size="12"
      inner-radius="86%"
      outer-radius="100%"
      :value-formatter="formatValue"
      aria-label="Water intake against the daily goal"
    >
      <template #center="{ total }">
        <span class="text-3xl font-bold text-foreground"
          >{{ Math.round((total / goal) * 100) }}%</span
        >
        <span class="text-xs text-muted">{{ formatValue(total) }} of {{ formatValue(goal) }}</span>
      </template>
    </RadialChart>
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { RadialChart } from '@hareui/vue/charts'

const goal = 2500
const data = [{ drink: 'Water', ml: 1600, fill: 'var(--chart-3)' }]

const formatValue = (value: number) => {
  return `${value.toLocaleString()} ml`
}
</script>
