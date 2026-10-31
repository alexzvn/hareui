<template>
  <div class="flex flex-wrap items-start justify-center gap-4">
    <EmptyState
      v-for="size in sizes"
      :key="size"
      class="w-[300px]"
      variant="outline"
      :size="size"
      :icon="icon('bell')"
      title="No notifications"
      description="Mentions and replies land here."
      :actions="[{ label: 'Settings' }, { label: 'Mark read', variant: 'outline' }]"
    />
  </div>
</template>

<script setup lang="ts">
import { EmptyState } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const sizes = ['sm', 'md', 'lg'] as const
</script>
