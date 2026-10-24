<script setup lang="ts">
import type { ColorSwatchPickerItem } from '@hareui/vue'
import { ColorSwatchPicker } from '@hareui/vue'

const colors: ColorSwatchPickerItem[] = ['#F43F5E', '#D946EF', '#8B5CF6', '#3B82F6', '#06B6D4', '#10B981', '#84CC16']
</script>

<template>
  <ColorSwatchPicker aria-label="Color" :items="colors">
    <template #indicator>
      <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 14s-6-3.7-6-8a3.5 3.5 0 0 1 6-2.4A3.5 3.5 0 0 1 14 6c0 4.3-6 8-6 8Z" />
      </svg>
    </template>
  </ColorSwatchPicker>
</template>
