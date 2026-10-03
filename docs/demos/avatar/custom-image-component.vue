<script setup lang="ts">
import { Avatar } from '@hareui/vue'

const SRC = 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg'
</script>

<template>
  <Avatar fallback="JD" :src="SRC">
    <template #image>
      <!-- Any image component works here, e.g. <NuxtImg> or <UnpicImage> -->
      <img alt="John Doe" height="40" :src="SRC" width="40" />
    </template>
  </Avatar>
</template>
