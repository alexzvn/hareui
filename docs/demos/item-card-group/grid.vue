<template>
  <ItemCardGroup layout="grid" class="w-full max-w-lg max-sm:grid-cols-1">
    <ItemCard
      v-for="item in items"
      :key="item.title"
      :icon="icon(item.icon)"
      :title="item.title"
      :description="item.description"
    />
  </ItemCardGroup>
</template>

<script setup lang="ts">
import { ItemCard, ItemCardGroup } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items = [
  { icon: 'person', title: 'Account', description: 'Name, photo, email' },
  { icon: 'lock', title: 'Privacy', description: 'Who can find you' },
  { icon: 'palette', title: 'Appearance', description: 'Theme and density' },
  { icon: 'bell', title: 'Alerts', description: 'Sounds and badges' },
]
</script>
