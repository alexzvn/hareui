<template>
  <div class="flex w-full max-w-md flex-col gap-3">
    <ItemCard
      v-for="item in items"
      :key="item.variant"
      :variant="item.variant"
      :icon="icon('layers')"
      :title="item.title"
      :description="item.description"
    >
      <template #action>
        <Icon icon="gravity-ui:chevron-right" class="size-4 text-muted" />
      </template>
    </ItemCard>
  </div>
</template>

<script setup lang="ts">
import type { ItemCardProps } from '@hareui/vue'
import { ItemCard } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: { variant: ItemCardProps['variant']; title: string; description: string }[] = [
  { variant: 'default', title: 'Default', description: 'Raised surface with a shadow' },
  { variant: 'secondary', title: 'Secondary', description: 'Tinted surface, flat' },
  { variant: 'tertiary', title: 'Tertiary', description: 'Deeper tint, flat' },
  { variant: 'outline', title: 'Outline', description: 'Border only' },
  { variant: 'transparent', title: 'Transparent', description: 'No surface at all' },
]
</script>
