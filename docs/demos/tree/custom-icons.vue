<template>
  <Tree
    :items="items"
    :indicator-icon="CaretIcon"
    :expanded-icon="OpenBookIcon"
    :collapsed-icon="BookIcon"
    class="w-72"
  />
</template>

<script setup lang="ts">
import type { TreeItem } from '@hareui/vue'
import { Tree } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const CaretIcon = icon('caret-right')
const BookIcon = icon('book')
const OpenBookIcon = icon('book-open')

const items: TreeItem[] = [
  {
    label: 'Field guide',
    defaultExpanded: true,
    children: [
      {
        label: 'Birds',
        defaultExpanded: true,
        children: [{ label: 'Kestrel' }, { label: 'Wren' }],
      },
      { label: 'Trees', children: [{ label: 'Rowan' }] },
    ],
  },
  { label: 'Tide tables', children: [{ label: 'October' }] },
]
</script>
