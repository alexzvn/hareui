<template>
  <ItemCardGroup class="w-full max-w-md">
    <ItemCard
      v-for="item in items"
      :key="item.title"
      :icon="icon(item.icon)"
      :title="item.title"
      :description="item.description"
    >
      <template #action>
        <Button size="sm" variant="outline">{{ item.action }}</Button>
      </template>
    </ItemCard>
  </ItemCardGroup>
</template>

<script setup lang="ts">
import { Button, ItemCard, ItemCardGroup } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items = [
  {
    icon: 'person',
    title: 'Display name',
    description: 'Shown on comments and invites',
    action: 'Edit',
  },
  { icon: 'key', title: 'Passkeys', description: 'Two passkeys on this account', action: 'Manage' },
  {
    icon: 'envelope',
    title: 'Contact email',
    description: 'Where we send receipts',
    action: 'Verify',
  },
]
</script>
