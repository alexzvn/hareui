<script setup lang="ts">
import { Tabs } from '@hareui/vue'

const items = [
  { label: 'Overview', value: 'overview', content: 'View your project overview and recent activity.' },
  { label: 'Analytics', value: 'analytics', content: 'Track your metrics and analyze performance data.' },
  { label: 'Reports', value: 'reports', content: 'Generate and download detailed reports.' },
]

const itemsWithDisabled = items.map((item, i) => (i === 1 ? { ...item, disabled: true } : item))
</script>

<template>
  <div class="flex flex-col gap-10">
    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Primary
      </h2>
      <Tabs :items="items" default-value="overview" class="w-96" />
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Secondary
      </h2>
      <Tabs :items="items" variant="secondary" default-value="overview" class="w-96" />
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Align start / end
      </h2>
      <div class="flex flex-col gap-4">
        <Tabs :items="items" align="start" default-value="overview" class="w-96" />
        <Tabs :items="items" align="end" default-value="overview" class="w-96" />
      </div>
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Vertical
      </h2>
      <div class="flex gap-10">
        <Tabs :items="items" orientation="vertical" default-value="overview" class="w-96" />
        <Tabs :items="items" orientation="vertical" variant="secondary" default-value="overview" class="w-96" />
      </div>
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Disabled tab
      </h2>
      <Tabs :items="itemsWithDisabled" default-value="overview" class="w-96" />
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Selected non-first tab
      </h2>
      <Tabs :items="items" default-value="analytics" class="w-96" />
    </section>
  </div>
</template>
