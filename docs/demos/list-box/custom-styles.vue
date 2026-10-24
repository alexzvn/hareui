<template>
  <ListBox
    aria-label="Assignee"
    class="w-56 rounded-xl border border-border/80 bg-surface p-1 shadow-sm"
    :items="users.slice(0, 2)"
    :ui="{ item: 'rounded-lg data-[focused=true]:bg-accent/10 data-[selected=true]:bg-accent/5' }"
  >
    <template #item-leading="{ item }">
      <Avatar size="sm" :alt="item.label" :src="item.avatar" :fallback="item.label?.[0]" />
    </template>
  </ListBox>
</template>

<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Avatar, ListBox } from '@hareui/vue'

interface User extends ListBoxItem {
  avatar: string
}

const users: User[] = [
  {
    value: '1',
    label: 'Bob',
    description: 'bob@heroui.com',
    avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg',
  },
  {
    value: '2',
    label: 'Fred',
    description: 'fred@heroui.com',
    avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg',
  },
]
</script>
