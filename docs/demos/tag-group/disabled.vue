<script setup lang="ts">
import { TagGroup } from '@hareui/vue'

const ownDisabled = [
  { id: 'news', label: 'News', disabled: true },
  { id: 'travel', label: 'Travel' },
  { id: 'gaming', label: 'Gaming', disabled: true },
]
const keyedItems = [
  { id: 'news', label: 'News' },
  { id: 'travel', label: 'Travel' },
  { id: 'gaming', label: 'Gaming' },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <TagGroup selection-mode="single" label="Disabled Tags" description="Some tags are disabled" :items="ownDisabled" />
    <TagGroup selection-mode="single" label="Disabled Keys" description="Tags disabled via disabledKeys prop" :items="keyedItems" :disabled-keys="['travel']" />
  </div>
</template>
