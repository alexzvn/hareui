<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <span class="text-sm text-muted">Circle (default)</span>
      <ColorSwatchPicker aria-label="Color, circle" :items="colors" variant="circle" />
    </div>
    <div class="flex flex-col gap-2">
      <span class="text-sm text-muted">Square</span>
      <ColorSwatchPicker aria-label="Color, square" :items="colors" variant="square" />
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
</script>
