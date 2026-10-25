<template>
  <Card
    class="w-full max-w-[380px] rounded-2xl"
    title="Study Time This Week"
    :ui="{ title: 'text-base', content: 'flex-row items-center gap-4' }"
  >
    <div class="flex flex-1 flex-col gap-2 self-start">
      <div v-for="item in data" :key="item.subject" class="flex flex-col">
        <span class="text-xs text-muted">{{ item.subject }}</span>
        <span class="text-sm font-semibold text-foreground">{{ item.detail }}</span>
      </div>
    </div>
    <RadialChart
      :data="data"
      index="subject"
      :width="200"
      :height="200"
      inner-radius="40%"
      outer-radius="100%"
      :value="{ formatter: formatMinutes }"
      class="shrink-0"
      aria-label="Study time by subject"
    >
      <template #center="{ total }">
        <span class="text-[10px]/3 text-muted">Total</span>
        <span class="text-sm font-semibold text-foreground">{{ total / 60 }} h</span>
      </template>
    </RadialChart>
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { RadialChart } from '@hareui/vue/charts'

const data = [
  { subject: 'Math', minutes: 360, fill: 'var(--chart-4)', detail: '6 of 8 hours' },
  { subject: 'Languages', minutes: 240, fill: 'var(--chart-3)', detail: '4 of 5 hours' },
  { subject: 'Science', minutes: 180, fill: 'var(--chart-2)', detail: '3 of 6 hours' },
]

const formatMinutes = (value: number) => {
  return `${value} min`
}
</script>
