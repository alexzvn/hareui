<template>
  <div class="flex w-72 flex-col gap-3">
    <Tree v-model="selected" :items="items" @select="onSelect" @toggle="onToggle" />
    <p class="text-xs text-muted">{{ log }}</p>
  </div>
</template>

<script setup lang="ts">
import type { TreeItem, TreeSelectEvent, TreeToggleEvent } from '@hareui/vue'
import { Tree } from '@hareui/vue'
import { ref } from 'vue'

const items: TreeItem[] = [
  {
    label: 'Inbox',
    defaultExpanded: true,
    children: [{ label: 'Flight confirmation' }, { label: 'Book club reminder' }],
  },
  { label: 'Archive', children: [{ label: 'Old receipts' }] },
  {
    label: 'Spam',
    onToggle: (event) => event.preventDefault(),
    children: [{ label: 'Prize notice' }],
  },
]

const selected = ref<TreeItem>()
const log = ref('Click a message or a folder.')

// Folders only expand: their selection is cancelled.
const onSelect = (event: TreeSelectEvent, item: TreeItem) => {
  if (item.children) event.preventDefault()
  log.value = `select: ${item.label}`
}

const onToggle = (_event: TreeToggleEvent, item: TreeItem) => {
  log.value = `toggle: ${item.label}`
}
</script>
