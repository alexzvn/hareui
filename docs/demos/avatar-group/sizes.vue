<template>
  <div class="flex flex-col items-center gap-6">
    <div v-for="s in sizes" :key="s.size" class="flex flex-col items-center gap-2">
      <p class="text-sm text-muted">{{ s.label }}</p>
      <AvatarGroup :size="s.size">
        <Avatar
          v-for="user in users.slice(0, 4)"
          :key="user.id"
          :alt="user.name"
          :fallback="initials(user.name)"
          :src="user.image"
        />
      </AvatarGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Avatar, AvatarGroup } from '@hareui/vue'

const users = [
  {
    id: 1,
    image: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg',
    name: 'John Doe',
  },
  {
    id: 2,
    image: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg',
    name: 'Kate Wilson',
  },
  {
    id: 3,
    image: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg',
    name: 'Emily Chen',
  },
  {
    id: 4,
    image: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg',
    name: 'Michael Brown',
  },
  {
    id: 5,
    image: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg',
    name: 'Olivia Davis',
  },
]

const initials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')

const sizes = [
  { size: 'sm', label: 'Small' },
  { size: 'md', label: 'Medium (default)' },
  { size: 'lg', label: 'Large' },
] as const
</script>
