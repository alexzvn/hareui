<script setup lang="ts">
import { Card, Chip } from '@hareui/vue'
import { BarChart } from '@hareui/vue/charts'
import { Icon } from '@iconify/vue'

const data = [
  { day: 'Mon', loaves: 64 },
  { day: 'Tue', loaves: 58 },
  { day: 'Wed', loaves: 71 },
  { day: 'Thu', loaves: 69 },
  { day: 'Fri', loaves: 92 },
  { day: 'Sat', loaves: 118 },
  { day: 'Sun', loaves: 103 },
]

const series = { loaves: { name: 'Loaves', color: 'var(--accent)' } }

function formatValue(value: number | string) {
  return `${value} loaves`
}
</script>

<template>
  <Card class="w-full max-w-[480px] rounded-2xl" :ui="{ header: 'flex-row items-center justify-between' }">
    <template #header>
      <div>
        <h3 class="text-base font-medium text-foreground">Sourdough Sales</h3>
        <p class="text-xs text-muted">Loaves sold this week</p>
      </div>
      <Chip color="success" size="sm" variant="soft">
        <template #leading>
          <Icon class="size-3" icon="gravity-ui:arrow-up" />
        </template>
        8.2%
      </Chip>
    </template>
    <BarChart
      :data="data"
      index="day"
      :series="series"
      :bar-size="20"
      :radius="24"
      aria-label="Sourdough loaves sold per day"
      :height="200"
      :tooltip="{ valueFormatter: formatValue }"
    />
  </Card>
</template>
