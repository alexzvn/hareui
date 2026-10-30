<template>
  <Tree :items="items" class="w-80">
    <template #item-wrapper="{ item, level, expanded, selected, ui }">
      <div :class="ui.link({ class: 'gap-2' })" :style="{ '--tree-level': level }">
        <span
          class="size-2 shrink-0 rounded-full"
          :class="selected ? 'bg-accent' : 'bg-default-hover'"
        />
        <span class="flex-1 truncate">{{ item.label }}</span>
        <span v-if="item.children" class="text-xs text-muted">{{
          expanded ? 'open' : item.children.length
        }}</span>
      </div>
    </template>
  </Tree>
</template>

<script setup lang="ts">
import type { TreeItem } from '@hareui/vue'
import { Tree } from '@hareui/vue'

const items: TreeItem[] = [
  {
    label: 'Roadmap',
    defaultExpanded: true,
    children: [
      { label: 'Q1', children: [{ label: 'Offline mode' }, { label: 'Dark theme' }] },
      { label: 'Q2', children: [{ label: 'Team billing' }] },
    ],
  },
  { label: 'Ideas', children: [{ label: 'Widgets' }] },
]
</script>
