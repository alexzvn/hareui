<script setup lang="ts">
import { Avatar, Badge } from '@hareui/vue'

const placements = ['top-right', 'top-left', 'bottom-right', 'bottom-left'] as const
</script>

<template>
  <div class="flex items-center gap-8">
    <div v-for="placement in placements" :key="placement" class="flex flex-col items-center gap-2">
      <Badge color="accent" :placement="placement" size="sm">
        <Avatar fallback="JD" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg" />
      </Badge>
      <span class="text-xs text-muted">{{ placement }}</span>
    </div>
  </div>
</template>
