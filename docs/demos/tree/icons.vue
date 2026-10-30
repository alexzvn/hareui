<template>
  <Tree :items="items" class="w-72">
    <template #item-leading="{ item, expanded, ui }">
      <Icon :icon="iconOf(item, expanded)" :class="ui.linkLeadingIcon()" />
    </template>
  </Tree>
</template>

<script setup lang="ts">
import type { TreeItem } from '@hareui/vue'
import { Tree } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const items: TreeItem[] = [
  {
    label: 'storefront',
    defaultExpanded: true,
    children: [
      {
        label: 'components',
        defaultExpanded: true,
        children: [
          { label: 'CartDrawer.vue' },
          { label: 'ProductCard.vue' },
          { label: 'prices.css' },
        ],
      },
      { label: 'images', children: [{ label: 'banner.png' }] },
      { label: 'main.ts' },
    ],
  },
  { label: 'package.json' },
  { label: 'notes.md' },
  { label: '.env.local' },
]

const ICONS: Record<string, string> = {
  vue: 'gravity-ui:file-code',
  ts: 'gravity-ui:file-code',
  css: 'gravity-ui:palette',
  png: 'gravity-ui:picture',
  json: 'gravity-ui:code',
  md: 'gravity-ui:file-text',
}

const iconOf = (item: TreeItem, expanded: boolean) => {
  if (item.children) return expanded ? 'gravity-ui:folder-open' : 'gravity-ui:folder'
  if (item.label?.startsWith('.env')) return 'gravity-ui:gear'

  const extension = item.label?.split('.').pop() ?? ''

  return ICONS[extension] ?? 'gravity-ui:file'
}
</script>
