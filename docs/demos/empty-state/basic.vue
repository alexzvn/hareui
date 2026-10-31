<template>
  <EmptyState
    class="w-full max-w-[420px]"
    :icon="icon('folder')"
    title="No projects yet"
    description="Projects group your boards and files. Create one to start planning with your team."
    :actions="[{ label: 'New project' }, { label: 'Import', variant: 'outline' }]"
  />
</template>

<script setup lang="ts">
import { EmptyState } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })
</script>
