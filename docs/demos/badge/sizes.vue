<script setup lang="ts">
import { Avatar, Badge } from 'herouse'

const sizes = ['sm', 'md', 'lg'] as const
</script>

<template>
  <div class="flex items-center gap-6">
    <Badge v-for="size in sizes" :key="size" color="danger" content="5" :size="size">
      <Avatar fallback="JD" :size="size" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg" />
    </Badge>
  </div>
</template>
