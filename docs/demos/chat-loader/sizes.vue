<template>
  <div class="flex flex-col gap-4">
    <div v-for="size in sizes" :key="size" class="flex items-center gap-6">
      <span class="w-6 text-xs text-muted">{{ size }}</span>
      <ChatLoader :size="size" />
      <ChatLoader variant="pulse" :size="size" />
      <ChatLoader variant="spinner" :size="size" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatLoaderProps } from '@hareui/vue'
import { ChatLoader } from '@hareui/vue'

const sizes: NonNullable<ChatLoaderProps['size']>[] = ['sm', 'md', 'lg']
</script>
