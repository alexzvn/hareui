<template>
  <div class="flex items-center gap-6">
    <Badge v-for="size in sizes" :key="size" color="danger" content="5" :size="size">
      <Avatar alt="John Doe" fallback="JD" :size="size" :src="avatarSrc" />
    </Badge>
  </div>
</template>

<script setup lang="ts">
import { Avatar, Badge } from '@hareui/vue'

const sizes = ['sm', 'md', 'lg'] as const
const avatarSrc = 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg'
</script>
