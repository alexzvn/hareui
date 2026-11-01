<template>
  <EmptyState
    class="w-full max-w-[420px]"
    variant="secondary"
    :icon="icon('envelope')"
    title="Inbox zero"
    description="Every thread is answered. New messages will appear here."
    :actions="[{ label: 'Compose' }]"
  />
</template>

<script setup lang="ts">
import { EmptyState } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })
</script>
