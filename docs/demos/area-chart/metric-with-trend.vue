<template>
  <div class="@container w-full max-w-[900px]">
    <div class="grid grid-cols-1 gap-3 @md:grid-cols-2 @2xl:grid-cols-3">
      <Card
        v-for="kpi in kpis"
        :key="kpi.id"
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
            <AreaChart
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
import { AreaChart } from '@hareui/vue/charts'
import { Icon } from '@iconify/vue'

function points(values: number[]) {
  return values.map((value, index) => ({ week: `Week ${index + 1}`, value }))
}

const kpis = [
  {
    id: 'kpi-riders',
    title: 'Active Riders',
    value: '4,210',
    trend: 'up',
    change: '5.4%',
    period: 'this week',
    color: 'var(--chart-3)',
    format: (value: number) => `${value.toLocaleString('en-US')} riders`,
    data: points([3410, 3520, 3480, 3660, 3740, 3700, 3850, 3920, 3990, 4060, 4130, 4210]),
  },
  {
    id: 'kpi-delivery',
    title: 'Avg. Delivery',
    value: '27 min',
    trend: 'down',
    change: '3.1%',
    period: 'vs last week',
    color: 'var(--success)',
    format: (value: number) => `${value} min`,
    data: points([34, 33, 35, 32, 31, 32, 30, 29, 30, 28, 28, 27]),
  },
  {
    id: 'kpi-cancel',
    title: 'Cancellations',
    value: '2.4%',
    trend: 'up',
    change: '0.6%',
    period: 'today',
    color: 'var(--danger)',
    format: (value: number) => `${value}%`,
    data: points([1.5, 1.6, 1.5, 1.8, 1.7, 1.9, 2.0, 1.9, 2.1, 2.2, 2.3, 2.4]),
  },
]

const margin = { top: 4, right: 0, bottom: 0, left: 0 }
</script>
