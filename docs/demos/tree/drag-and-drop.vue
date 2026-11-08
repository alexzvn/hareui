<template>
  <Tree
    v-model="selected"
    :items="items"
    multiple
    selection-behavior="replace"
    draggable
    :can-drop="canDrop"
    class="w-72"
    @move="items = moveTreeItems(items, $event)"
  >
    <template #item-leading="{ item, expanded, ui }">
      <Icon :icon="iconOf(item, expanded)" :class="ui.linkLeadingIcon()" />
    </template>
  </Tree>
</template>

<script setup lang="ts">
import type { TreeItem, TreeMoveEvent } from '@hareui/vue'
import { moveTreeItems, Tree } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const items = ref<TreeItem[]>([
  {
    label: 'src',
    defaultExpanded: true,
    children: [
      {
        label: 'components',
        defaultExpanded: true,
        children: [{ label: 'TrailMap.vue' }, { label: 'hero.png' }, { label: 'SummitCard.vue' }],
      },
      { label: 'lib', children: [{ label: 'distance.ts' }] },
      { label: 'main.ts' },
    ],
  },
  {
    label: 'public',
    defaultExpanded: true,
    children: [{ label: 'favicon.png' }],
  },
  { label: 'ridge.jpg' },
  { label: 'README.md' },
  { label: 'package.json' },
])

const selected = ref<TreeItem[]>([])

const ICONS: Record<string, string> = {
  vue: 'gravity-ui:file-code',
  ts: 'gravity-ui:file-code',
  png: 'gravity-ui:picture',
  jpg: 'gravity-ui:picture',
  json: 'gravity-ui:code',
  md: 'gravity-ui:file-text',
}

const iconOf = (item: TreeItem, expanded: boolean) => {
  if (item.children) return expanded ? 'gravity-ui:folder-open' : 'gravity-ui:folder'

  return ICONS[item.label?.split('.').pop() ?? ''] ?? 'gravity-ui:file'
}

// The folder that holds `item`; undefined at the top level
const parentOf = (item: TreeItem, list = items.value): TreeItem | undefined => {
  for (const folder of list) {
    if (folder.children?.includes(item)) return folder

    const parent = folder.children && parentOf(item, folder.children)
    if (parent) return parent
  }

  return undefined
}

const isImage = (item: TreeItem) => /\.(jpe?g|png)$/.test(item.label ?? '')

// Only images go in public
const canDrop = ({ items: moved, target, position }: TreeMoveEvent) => {
  const folder = position === 'inside' ? target : parentOf(target)

  return folder?.label !== 'public' || moved.every(isImage)
}
</script>
