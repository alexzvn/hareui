<template>
  <TagGroup aria-label="Tags" selection-mode="single" :items="items">
    <template #item="{ item }">
      <Icon :icon="icons[item.id]!" />
      {{ item.label }}
    </template>
  </TagGroup>
</template>

<script setup lang="ts">
import type { TagGroupItem } from '@hareui/vue'
import { TagGroup } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const items: TagGroupItem[] = [
  { id: 'default-news', label: 'News' },
  { id: 'default-travel', label: 'Travel' },
  { id: 'default-gaming', label: 'Gaming' },
  { id: 'default-shopping', label: 'Shopping' },
]

const icons: Record<string, string> = {
  'default-news': 'gravity-ui:square-article',
  'default-travel': 'gravity-ui:planet-earth',
  'default-gaming': 'gravity-ui:rocket',
  'default-shopping': 'gravity-ui:shopping-bag',
}
</script>
