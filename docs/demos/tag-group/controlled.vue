<script setup lang="ts">
import { TagGroup } from 'herouse'
import { computed, ref } from 'vue'

const items = [
  { id: 'news', label: 'News' },
  { id: 'travel', label: 'Travel' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'shopping', label: 'Shopping' },
]
const selected = ref<string[]>(['news', 'travel'])
const description = computed(() => `Selected: ${selected.value.length ? selected.value.join(', ') : 'None'}`)
</script>

<template>
  <div class="flex flex-col gap-3">
    <TagGroup v-model:selected="selected" selection-mode="multiple" label="Categories (controlled)" :description="description" :items="items" />
  </div>
</template>
