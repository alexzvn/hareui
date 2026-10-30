<template>
  <div class="flex flex-col gap-3">
    <div v-for="color in colors" :key="color" class="flex items-center gap-4">
      <span class="w-16 text-sm text-muted">{{ color }}</span>
      <Rating :color="color" :aria-label="`${color} rating`" :default-value="4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RatingProps } from '@hareui/vue'
import { Rating } from '@hareui/vue'

const colors: NonNullable<RatingProps['color']>[] = [
  'warning',
  'accent',
  'success',
  'danger',
  'default',
]
</script>
