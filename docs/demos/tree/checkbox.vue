<template>
  <div class="flex w-72 flex-col gap-3">
    <Tree
      v-model="selected"
      :items="items"
      multiple
      checkbox
      propagate-select
      bubble-select
      @select="onSelect"
    />
    <p class="text-xs text-muted">Backing up: {{ files || 'nothing' }}</p>
  </div>
</template>

<script setup lang="ts">
import type { TreeItem, TreeSelectEvent } from '@hareui/vue'
import { Tree } from '@hareui/vue'
import { computed, shallowRef } from 'vue'

const items: TreeItem[] = [
  {
    label: 'Documents',
    defaultExpanded: true,
    children: [
      { label: 'Taxes', children: [{ label: 'return-2025.pdf' }, { label: 'receipts.zip' }] },
      {
        label: 'Letters',
        defaultExpanded: true,
        children: [{ label: 'landlord.docx' }, { label: 'reference.docx' }],
      },
    ],
  },
  { label: 'Desktop', children: [{ label: 'screenshot.png' }] },
]

// shallowRef: v-model replaces the array, and items can hold icon components deep unwrapping can't type.
const selected = shallowRef<TreeItem[]>([])

const files = computed(() =>
  selected.value
    .filter((item) => !item.children)
    .map((item) => item.label)
    .join(', '),
)

// Clicking a row only expands it; the checkbox toggles the selection.
const onSelect = (event: TreeSelectEvent) => {
  if (event.detail.originalEvent.type === 'click') event.preventDefault()
}
</script>
