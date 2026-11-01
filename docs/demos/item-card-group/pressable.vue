<template>
  <ItemCardGroup
    title="Workspace"
    description="Settings shared by everyone in Northwind"
    class="w-full max-w-md"
  >
    <ItemCard
      v-for="item in items"
      :key="item.href"
      :href="item.href"
      :icon="icon(item.icon)"
      :title="item.title"
      :description="item.description"
    >
      <template #action>
        <Icon icon="gravity-ui:chevron-right" class="size-4 text-muted" />
      </template>
    </ItemCard>
  </ItemCardGroup>
</template>

<script setup lang="ts">
import { ItemCard, ItemCardGroup } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items = [
  {
    href: '#members',
    icon: 'persons',
    title: 'Members',
    description: '14 people, 3 pending invites',
  },
  { href: '#roles', icon: 'shield-check', title: 'Roles', description: 'Who can edit and publish' },
  {
    href: '#billing',
    icon: 'credit-card',
    title: 'Billing',
    description: 'Team plan, renews in May',
  },
]
</script>
