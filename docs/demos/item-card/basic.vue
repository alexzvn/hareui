<template>
  <ItemCard
    :icon="icon('clock')"
    title="Time zone"
    description="Used for reminders and weekly reports"
    class="w-full max-w-md"
  >
    <template #action>
      <Button size="sm" variant="outline">Change</Button>
    </template>
  </ItemCard>
</template>

<script setup lang="ts">
import { Button, ItemCard } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })
</script>
