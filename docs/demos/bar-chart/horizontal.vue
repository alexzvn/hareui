<template>
  <Card
    class="w-full max-w-[420px] rounded-2xl"
    title="Top Editor Commands"
    description="Runs in the last 30 days"
    :ui="{ title: 'text-base', description: 'text-xs' }"
  >
    <BarChart
      :data="data"
      index="command"
      :series="series"
      layout="vertical"
      :bar="{ size: 14 }"
      :radius="24"
      aria-label="Most-run editor commands"
      :height="220"
    />
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { BarChart } from '@hareui/vue/charts'

const data = [
  { command: 'Format', runs: 2140 },
  { command: 'Go to file', runs: 1785 },
  { command: 'Rename', runs: 1206 },
  { command: 'Search', runs: 964 },
  { command: 'Terminal', runs: 611 },
]

const series = {
  runs: { name: 'Runs', valueFormatter: (value: number) => value.toLocaleString('en-US') },
}
</script>
