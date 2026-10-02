<script setup lang="ts">
import { Avatar, ListBox } from 'herouse'
const users = [
  { value: '1', label: 'Bob', description: 'bob@heroui.com', avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg' },
  { value: '2', label: 'Fred', description: 'fred@heroui.com', avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg' },
  { value: '3', label: 'Martha', description: 'martha@heroui.com', avatar: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg' },
]
</script>

<template>
  <ListBox aria-label="Users" class="w-[220px]" :items="users">
    <template #item-leading="{ item }">
      <Avatar size="sm" :alt="item.label" :src="(item as any).avatar" :fallback="item.label?.[0]" />
    </template>
  </ListBox>
</template>
