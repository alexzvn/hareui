<template>
  <div class="flex w-full max-w-md flex-col gap-6">
    <ItemCardGroup v-for="group in groups" :key="group.variant" :variant="group.variant">
      <ItemCard :icon="icon('folder')" :title="group.label" description="Shared files">
        <template #action>
          <Icon icon="gravity-ui:chevron-right" class="size-4 text-muted" />
        </template>
      </ItemCard>
      <ItemCard :icon="icon('clock')" title="Recent" description="Opened this week">
        <template #action>
          <Icon icon="gravity-ui:chevron-right" class="size-4 text-muted" />
        </template>
      </ItemCard>
    </ItemCardGroup>
  </div>
</template>

<script setup lang="ts">
import type { ItemCardGroupVariant } from '@hareui/vue'
import { ItemCard, ItemCardGroup } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const groups: { variant: ItemCardGroupVariant; label: string }[] = [
  { variant: 'default', label: 'Default' },
  { variant: 'secondary', label: 'Secondary' },
  { variant: 'tertiary', label: 'Tertiary' },
  { variant: 'outline', label: 'Outline' },
  { variant: 'transparent', label: 'Transparent' },
]
</script>
