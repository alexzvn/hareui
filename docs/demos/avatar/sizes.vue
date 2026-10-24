<script setup lang="ts">
import { Avatar } from '@hareui/vue'
</script>

<template>
  <div class="flex items-center gap-4">
    <Avatar
      alt="Small Avatar"
      fallback="SM"
      size="sm"
      src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
    />
    <Avatar
      alt="Medium Avatar"
      fallback="MD"
      size="md"
      src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg"
    />
    <Avatar
      alt="Large Avatar"
      fallback="LG"
      size="lg"
      src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg"
    />
  </div>
</template>
