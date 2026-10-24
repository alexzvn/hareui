<template>
  <div class="@container w-full max-w-[900px]">
    <div class="grid grid-cols-1 gap-3 @md:grid-cols-2 @2xl:grid-cols-3">
      <Card
        v-for="kpi in kpis"
        :key="kpi.title"
        class="rounded-2xl"
        :title="kpi.title"
        :ui="{ title: 'text-muted' }"
      >
        <div class="grid grid-cols-2 items-end gap-x-2">
          <div class="flex flex-col gap-1">
            <span class="text-3xl font-semibold text-foreground tabular-nums">{{ kpi.value }}</span>
            <Chip
              :color="kpi.color === 'var(--danger)' ? 'danger' : 'success'"
              size="sm"
              variant="tertiary"
              class="self-start whitespace-nowrap"
            >
              <template #leading>
                <Icon
                  class="size-3"
                  :icon="kpi.trend === 'up' ? 'gravity-ui:arrow-up' : 'gravity-ui:arrow-down'"
                />
              </template>
              {{ kpi.change }} <span class="text-muted">{{ kpi.period }}</span>
            </Chip>
          </div>
          <div class="min-w-0">
            <LineChart
              :data="kpi.data"
              index="week"
              :series="{ value: { name: kpi.title, color: kpi.color } }"
              sparkline
              :value-formatter="kpi.format"
              :tooltip="{ cursor: false, panel: false }"
              :aria-label="`${kpi.title} trend`"
              :height="70"
              :margin="margin"
            />
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, Chip } from '@hareui/vue'
import { LineChart } from '@hareui/vue/charts'
import { Icon } from '@iconify/vue'

function points(values: number[]) {
  return values.map((value, index) => ({ week: `Week ${index + 1}`, value }))
}

const kpis = [
  {
    title: 'Cups Sold',
    value: '1,482',
    trend: 'up',
    change: '4.1%',
    period: 'this week',
    color: 'var(--chart-3)',
    format: (value: number) => `${value} cups`,
    data: points([118, 131, 124, 140, 152, 147, 166, 171, 158, 180, 192, 205]),
  },
  {
    title: 'Wait Time',
    value: '3m 40s',
    trend: 'down',
    change: '12%',
    period: 'vs last week',
    color: 'var(--success)',
    format: (value: number) => `${Math.floor(value / 60)}m ${value % 60}s`,
    data: points([290, 284, 296, 270, 262, 268, 251, 244, 238, 231, 226, 220]),
  },
  {
    title: 'Wasted Pastries',
    value: '27',
    trend: 'up',
    change: '8.0%',
    period: 'today',
    color: 'var(--danger)',
    format: (value: number) => `${value} pastries`,
    data: points([14, 12, 15, 13, 17, 16, 19, 18, 22, 21, 24, 27]),
  },
]

const margin = { top: 4, right: 0, bottom: 0, left: 0 }
</script>
