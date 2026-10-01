<script setup lang="ts">
import { Avatar } from 'herouse'
</script>

<template>
  <div class="flex items-center gap-4">
    <Avatar alt="John Doe" fallback="JD" src="https://img.heroui.chat/image/avatar?w=400&h=400&u=3" />
    <Avatar alt="Blue" fallback="B" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg" />
    <Avatar fallback="JR" />
  </div>
</template>
