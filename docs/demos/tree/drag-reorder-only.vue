<template>
  <Tree
    :items="items"
    draggable
    :can-drop="canDrop"
    class="w-72"
    @move="items = moveTreeItems(items, $event)"
  />
</template>

<script setup lang="ts">
import type { TreeItem, TreeMoveEvent } from '@hareui/vue'
import { moveTreeItems, Tree } from '@hareui/vue'
import { ref } from 'vue'

const items = ref<TreeItem[]>([
  {
    label: 'Getting started',
    defaultExpanded: true,
    children: [{ label: 'Install' }, { label: 'First project' }, { label: 'Deploy' }],
  },
  {
    label: 'Guides',
    defaultExpanded: true,
    children: [{ label: 'Routing' }, { label: 'Forms' }, { label: 'Testing' }],
  },
  { label: 'Changelog', children: [] },
])

// The list that holds `item`: the chapter's pages, or the chapters themselves
const siblingsOf = (item: TreeItem) =>
  items.value.find((chapter) => chapter.children?.includes(item))?.children ?? items.value

// Pages and chapters change places with their siblings only
const canDrop = ({ items: moved, target, position }: TreeMoveEvent) =>
  position !== 'inside' && moved.every((item) => siblingsOf(item) === siblingsOf(target))
</script>
