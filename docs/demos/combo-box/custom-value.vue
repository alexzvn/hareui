<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Avatar, ComboBox } from '@hareui/vue'

interface User extends ListBoxItem {
  avatarUrl: string
  fallback: string
}

const users: User[] = [
  { value: '1', label: 'Bob', description: 'bob@heroui.com', avatarUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg', fallback: 'B' },
  { value: '2', label: 'Fred', description: 'fred@heroui.com', avatarUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg', fallback: 'F' },
  { value: '3', label: 'Martha', description: 'martha@heroui.com', avatarUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg', fallback: 'M' },
  { value: '4', label: 'John', description: 'john@heroui.com', avatarUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg', fallback: 'J' },
  { value: '5', label: 'Jane', description: 'jane@heroui.com', avatarUrl: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg', fallback: 'J' },
]
</script>

<template>
  <ComboBox class="w-[256px]" label="User" placeholder="Search users..." :items="users">
    <template #item-leading="{ item }">
      <Avatar size="sm" :src="item.avatarUrl" :fallback="item.fallback" />
    </template>
  </ComboBox>
</template>
