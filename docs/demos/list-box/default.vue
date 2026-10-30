<template>
  <ListBox aria-label="Users" class="w-[220px]" :items="users">
    <template #item-leading="{ item }">
      <Avatar size="sm" :alt="item.label" :src="item.avatar" :fallback="item.label?.[0]" />
    </template>
  </ListBox>
</template>

<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Avatar, ListBox } from '@hareui/vue'

type User = {
  avatar: string
} & ListBoxItem

const users: User[] = [
  {
    value: '1',
    label: 'Bob',
    description: 'bob@example.com',
    avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg',
  },
  {
    value: '2',
    label: 'Fred',
    description: 'fred@example.com',
    avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg',
  },
  {
    value: '3',
    label: 'Martha',
    description: 'martha@example.com',
    avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg',
  },
]
</script>
