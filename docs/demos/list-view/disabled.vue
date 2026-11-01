<template>
  <ListView :items="items" selectable multiple aria-label="Shared drives" class="max-w-md">
    <template #item-action="{ disabled }">
      <Icon
        v-if="disabled"
        icon="gravity-ui:lock"
        class="size-3.5 text-muted"
        aria-label="Locked"
      />
    </template>
  </ListView>
</template>

<script setup lang="ts">
import type { ListViewItem } from '@hareui/vue'
import { ListView } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const items: ListViewItem[] = [
  { value: 'design', label: 'Design', icon: icon('folder') },
  { value: 'finance', label: 'Finance', icon: icon('folder'), disabled: true },
  { value: 'marketing', label: 'Marketing', icon: icon('folder') },
  { value: 'legal', label: 'Legal', icon: icon('folder'), disabled: true },
  { value: 'support', label: 'Support', icon: icon('folder') },
]
</script>
