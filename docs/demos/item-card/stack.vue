<template>
  <div class="flex w-full max-w-md flex-col gap-2">
    <ItemCard
      v-for="session in sessions"
      :key="session.id"
      :icon="icon(session.icon)"
      :title="session.name"
      :description="session.seen"
    >
      <template #action>
        <Chip v-if="session.isCurrent" color="success" size="sm" variant="soft">This device</Chip>
        <Button v-else size="sm" variant="outline">Sign out</Button>
      </template>
    </ItemCard>
  </div>
</template>

<script setup lang="ts">
import { Button, Chip, ItemCard } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const sessions = [
  {
    id: 'laptop',
    icon: 'display',
    name: 'Studio laptop',
    seen: 'Lisbon · active now',
    isCurrent: true,
  },
  {
    id: 'tablet',
    icon: 'house',
    name: 'Kitchen tablet',
    seen: 'Lisbon · 4 days ago',
    isCurrent: false,
  },
  {
    id: 'phone',
    icon: 'smartphone',
    name: 'Pocket phone',
    seen: 'Porto · yesterday',
    isCurrent: false,
  },
]
</script>
