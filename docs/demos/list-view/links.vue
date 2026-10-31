<template>
  <ListView :items="items" aria-label="Related components" class="max-w-md" />
</template>

<script setup lang="ts">
import type { ListViewItem } from '@hareui/vue'
import { ListView } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const items: ListViewItem[] = [
  {
    value: 'list-box',
    label: 'ListBox',
    description: 'Options to pick from',
    icon: icon('list-ul'),
    href: './list-box',
  },
  {
    value: 'tree',
    label: 'Tree',
    description: 'Nested folders and files',
    icon: icon('folder-tree'),
    href: './tree',
  },
  {
    value: 'table',
    label: 'Table',
    description: 'Rows and columns',
    icon: icon('layout-rows'),
    href: './table',
  },
]
</script>
