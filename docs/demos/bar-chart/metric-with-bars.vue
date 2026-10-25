<template>
  <Card
    class="w-full max-w-[400px] rounded-2xl"
    title="Parcels Shipped"
    :ui="{ title: 'text-muted' }"
  >
    <div class="flex flex-col gap-3">
      <div class="flex gap-3 self-start">
        <span class="text-3xl font-semibold text-foreground tabular-nums">1,854</span>
        <Chip color="success" size="sm" variant="tertiary" class="whitespace-nowrap">
          <template #leading>
            <Icon class="size-3" icon="gravity-ui:arrow-up" />
          </template>
          6.8% <span class="text-muted">vs last quarter</span>
        </Chip>
      </div>
      <BarChart
        :data="data"
        index="week"
        :series="series"
        :bar="{ size: 16 }"
        :radius="24"
        :y-axis="{ left: false }"
        aria-label="Parcels shipped per week"
        :height="160"
      />
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card, Chip } from '@hareui/vue'
import { BarChart } from '@hareui/vue/charts'
import { Icon } from '@iconify/vue'

const data = [
  { week: 'W1', parcels: 182 },
  { week: 'W2', parcels: 214 },
  { week: 'W3', parcels: 197 },
  { week: 'W4', parcels: 238 },
  { week: 'W5', parcels: 226 },
  { week: 'W6', parcels: 261 },
  { week: 'W7', parcels: 249 },
  { week: 'W8', parcels: 287 },
]

const series = { parcels: { name: 'Parcels', color: 'var(--accent)' } }
</script>
