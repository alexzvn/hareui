<script setup lang="ts">
import { Card, Chip } from '@hareui/vue'
import { LineChart } from '@hareui/vue/charts'
import { Icon } from '@iconify/vue'

const stats = [
  { label: 'Books Borrowed', value: '3,912', trend: 'up', change: '6.4%' },
  { label: 'Overdue', value: '148', trend: 'down', change: '2.1%' },
  { label: 'New Members', value: '57', trend: 'up', change: '9.6%' },
]

const data = [
  { month: 'Jan', loans: 2840 },
  { month: 'Feb', loans: 3120 },
  { month: 'Mar', loans: 2960 },
  { month: 'Apr', loans: 3380 },
  { month: 'May', loans: 3210 },
  { month: 'Jun', loans: 2740 },
  { month: 'Jul', loans: 3590 },
  { month: 'Aug', loans: 3820 },
  { month: 'Sep', loans: 3460 },
  { month: 'Oct', loans: 3650 },
  { month: 'Nov', loans: 3780 },
  { month: 'Dec', loans: 3912 },
]

function formatTick(value: number) {
  return `${(value / 1000).toFixed(1)}k`
}

const series = { loans: { name: 'Loans', valueFormatter: (value: number) => `${value.toLocaleString()} books` } }
</script>

<template>
  <div class="flex w-full max-w-[700px] flex-col gap-3">
    <div class="@container">
      <div class="grid grid-cols-1 gap-3 @xl:grid-cols-3">
        <Card v-for="stat in stats" :key="stat.label" class="gap-1 rounded-2xl" :description="stat.label" :ui="{ description: 'text-sm font-medium' }">
          <div class="flex flex-row items-center gap-2">
            <span class="flex-1 text-2xl font-semibold text-foreground">{{ stat.value }}</span>
            <Chip :color="stat.trend === 'up' ? 'success' : 'danger'" size="sm" variant="soft" class="whitespace-nowrap">
              <template #leading>
                <Icon class="size-3" :icon="stat.trend === 'up' ? 'gravity-ui:arrow-up' : 'gravity-ui:arrow-down'" />
              </template>
              {{ stat.change }}
            </Chip>
          </div>
        </Card>
      </div>
    </div>
    <Card class="rounded-2xl" title="Loans per Month" :ui="{ title: 'text-base' }">
      <LineChart
        :data="data"
        index="month"
        :series="series"
        aria-label="Library loans per month"
        :height="200"
        :y-axis="{ tickFormatter: formatTick }"
      />
    </Card>
  </div>
</template>
