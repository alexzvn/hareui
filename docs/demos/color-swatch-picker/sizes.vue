<template>
  <div class="flex flex-col gap-6">
    <div v-for="size in sizes" :key="size" class="flex items-center gap-4">
      <span class="w-8 text-sm text-muted">{{ size }}</span>
      <ColorSwatchPicker :aria-label="`Color, ${size}`" :items="colors" :size="size" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ColorSwatchPickerItem } from '@hareui/vue'
import { ColorSwatchPicker } from '@hareui/vue'

const colors: ColorSwatchPickerItem[] = [
  '#F43F5E',
  '#D946EF',
  '#8B5CF6',
  '#3B82F6',
  '#06B6D4',
  '#10B981',
  '#84CC16',
]
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
</script>
