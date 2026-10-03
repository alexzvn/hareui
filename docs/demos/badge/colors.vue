<script setup lang="ts">
import { Avatar, Badge } from '@hareui/vue'

const colors = ['default', 'accent', 'success', 'warning', 'danger'] as const
</script>

<template>
  <div class="flex items-center gap-6">
    <Badge v-for="color in colors" :key="color" :color="color" size="sm">
      <Avatar fallback="JD" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg" />
    </Badge>
  </div>
</template>
