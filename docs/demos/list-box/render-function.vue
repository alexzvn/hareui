<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Avatar, ListBox } from '@hareui/vue'

interface User extends ListBoxItem {
  avatar: string
}

const users: User[] = [
  { value: '1', label: 'Bob', description: 'bob@heroui.com', avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg' },
  { value: '2', label: 'Fred', description: 'fred@heroui.com', avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg' },
  { value: '3', label: 'Martha', description: 'martha@heroui.com', avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg' },
]
</script>

<template>
  <!-- HeroUI's `render` prop has no Vue equivalent (plan drop: render functions); attributes fall through instead. -->
  <ListBox aria-label="Users" class="w-[220px]" data-custom="true" :items="users">
    <template #item-leading="{ item }">
      <Avatar size="sm" :alt="item.label" :src="item.avatar" :fallback="item.label?.[0]" />
    </template>
  </ListBox>
</template>
