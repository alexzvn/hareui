<template>
  <div class="flex flex-col gap-3">
    <div v-for="size in sizes" :key="size" class="flex items-center gap-4">
      <span class="w-8 text-sm text-muted">{{ size }}</span>
      <Rating :size="size" :aria-label="`Rating, size ${size}`" :default-value="2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RatingProps } from '@hareui/vue'
import { Rating } from '@hareui/vue'

const sizes: NonNullable<RatingProps['size']>[] = ['sm', 'md', 'lg']
</script>
