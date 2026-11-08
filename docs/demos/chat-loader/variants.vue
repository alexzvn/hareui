<template>
  <div class="flex w-full max-w-sm flex-col gap-6">
    <div v-for="variant in variants" :key="variant" class="flex flex-col gap-2">
      <span class="text-xs text-muted">{{ variant }}</span>
      <ChatLoader :variant="variant" />
    </div>
    <div class="flex flex-col gap-2">
      <span class="text-xs text-muted">skeleton, 2 lines</span>
      <ChatLoader variant="skeleton" :lines="2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatLoaderProps } from '@hareui/vue'
import { ChatLoader } from '@hareui/vue'

const variants: NonNullable<ChatLoaderProps['variant']>[] = ['dots', 'pulse', 'spinner', 'skeleton']
</script>
