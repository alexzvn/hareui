<template>
  <EmptyState
    class="w-full max-w-[420px]"
    variant="outline"
    :icon="icon('cloud-arrow-up-in')"
    title="Drop files to upload"
    description="PDF, PNG or JPG, up to 20 MB each. Files stay private until you share them."
    :actions="[{ label: 'Browse files', variant: 'outline', size: 'sm' }]"
  />
</template>

<script setup lang="ts">
import { EmptyState } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })
</script>
