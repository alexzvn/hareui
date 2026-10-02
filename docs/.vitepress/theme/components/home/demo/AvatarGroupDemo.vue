<script setup lang="ts">
import { Avatar, AvatarGroup } from 'herouse'

const avatars = [
  { image: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg', name: 'Blue' },
  { image: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg', name: 'Green' },
  { image: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg', name: 'Purple' },
  { image: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg', name: 'Orange' },
  { image: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg', name: 'red' },
  { image: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg', name: 'Blue' },
  { image: 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/black.jpg', name: 'Black' },
]
</script>

<template>
  <div class="flex w-full justify-center">
    <AvatarGroup :max="5">
      <Avatar
        v-for="(item, index) in avatars"
        :key="`${item.name}-${index}`"
        :alt="item.name"
        :fallback="item.name.split(' ').map(n => n[0]).join('')"
        :src="item.image"
      />
    </AvatarGroup>
  </div>
</template>
