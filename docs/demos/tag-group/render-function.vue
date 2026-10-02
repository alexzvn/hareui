<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { TagGroup } from 'herouse'

const icons: Record<string, string> = {
  'default-news': 'gravity-ui:square-article',
  'default-travel': 'gravity-ui:planet-earth',
  'default-gaming': 'gravity-ui:rocket',
  'default-shopping': 'gravity-ui:shopping-bag',
}
const items = [
  { id: 'default-news', label: 'News' },
  { id: 'default-travel', label: 'Travel' },
  { id: 'default-gaming', label: 'Gaming' },
  { id: 'default-shopping', label: 'Shopping' },
]
</script>

<template>
  <!-- Attributes fall through to the root element (HeroUI's `render` prop) -->
  <TagGroup aria-label="Tags" data-custom="foo" selection-mode="single" :items="items">
    <template #item="{ item }">
      <Icon :icon="icons[item.id]!" />
      {{ item.label }}
    </template>
  </TagGroup>
</template>
