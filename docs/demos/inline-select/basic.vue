<script setup lang="ts">
import type { ListBoxItem, SelectValue } from '@hareui/vue'
import { InlineSelect } from '@hareui/vue'
import { ref } from 'vue'

const sortOptions: ListBoxItem[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'popular', label: 'Most popular' },
  { value: 'price', label: 'Lowest price' },
]

const sort = ref<SelectValue>('newest')
</script>

<template>
  <InlineSelect v-model="sort" aria-label="Sort by" :items="sortOptions" :ui="{ popover: 'w-44' }" />
</template>
