<script setup lang="ts">
import { Metric, MetricGroup } from '@hareui/vue'

const items = [
  { title: 'Views', value: 18240, trend: { value: '+9%' } },
  { title: 'Visitors', value: 4031, trend: { value: '+2%' } },
  { title: 'Bounce', value: 0.38, trend: { value: '+1%', trend: 'down' as const } },
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-semibold">MetricGroup</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Row</h2>
      <MetricGroup>
        <Metric v-for="item in items" :key="item.title" v-bind="item" />
      </MetricGroup>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Stacked</h2>
      <MetricGroup stacked class="max-w-64">
        <Metric v-for="item in items" :key="item.title" v-bind="item" />
      </MetricGroup>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Stacked below md</h2>
      <MetricGroup stacked="md">
        <Metric v-for="item in items" :key="item.title" v-bind="item" />
      </MetricGroup>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override</h2>
      <MetricGroup :ui="{ base: 'bg-surface-secondary rounded-3xl' }">
        <Metric v-for="item in items" :key="item.title" v-bind="item" variant="secondary" />
      </MetricGroup>
    </section>
  </div>
</template>
