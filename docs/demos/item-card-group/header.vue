<template>
  <ItemCardGroup
    title="Notifications"
    description="Choose what reaches you outside the app"
    class="w-full max-w-md"
  >
    <ItemCard
      v-for="item in items"
      :key="item.id"
      :icon="icon(item.icon)"
      :title="item.title"
      :description="item.description"
    >
      <template #action>
        <Switch v-model="item.isOn" :aria-label="item.title" />
      </template>
    </ItemCard>
  </ItemCardGroup>
</template>

<script setup lang="ts">
import { ItemCard, ItemCardGroup, Switch } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, reactive } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items = reactive([
  {
    id: 'mentions',
    icon: 'at',
    title: 'Mentions',
    description: 'When someone tags you',
    isOn: true,
  },
  {
    id: 'digest',
    icon: 'envelope',
    title: 'Weekly digest',
    description: 'A summary every Monday',
    isOn: false,
  },
  {
    id: 'security',
    icon: 'shield-check',
    title: 'Security alerts',
    description: 'New sign-ins and changes',
    isOn: true,
  },
])
</script>
