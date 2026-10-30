<template>
  <Tree :items="items" class="w-72">
    <template #shared-label="{ item }">
      <span class="text-accent">{{ item.label }}</span>
    </template>
    <template #shared-trailing>
      <Icon icon="gravity-ui:persons" class="size-4" aria-label="Shared" />
    </template>
  </Tree>
</template>

<script setup lang="ts">
import type { TreeItem } from '@hareui/vue'
import { Tree } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const items: TreeItem[] = [
  {
    label: 'Drive',
    defaultExpanded: true,
    children: [
      { label: 'Family budget', slot: 'shared', children: [{ label: 'october.xlsx' }] },
      { label: 'Wedding playlist', slot: 'shared' },
      { label: 'Private notes' },
    ],
  },
]
</script>
