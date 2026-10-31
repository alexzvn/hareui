<template>
  <Surface class="w-[220px] rounded-3xl shadow-surface">
    <ListBox aria-label="File actions" class="w-full p-2" :items="items" selection-mode="none" />
  </Surface>
</template>

<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { ListBox, Surface } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const items: ListBoxItem[] = [
  { value: 'new', label: 'New file', icon: icon('file-plus') },
  { value: 'copy', label: 'Copy link', icon: icon('link') },
  { value: 'edit', label: 'Edit file', icon: icon('pencil') },
  { value: 'move', label: 'Move to folder', icon: icon('folder-arrow-right') },
]
</script>
