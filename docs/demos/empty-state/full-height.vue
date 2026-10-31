<template>
  <div
    class="flex h-[400px] w-full max-w-[500px] items-center justify-center rounded-2xl border border-dashed border-border"
  >
    <EmptyState
      :icon="icon('magnifier')"
      title="No matching orders"
      description="Try another date range or clear the status filter."
      :actions="[{ label: 'Clear filters', variant: 'outline', size: 'sm' }]"
      :ui="{ description: 'max-w-xs' }"
    />
  </div>
</template>

<script setup lang="ts">
import { EmptyState } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })
</script>
