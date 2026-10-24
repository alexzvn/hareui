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

<template>
  <ColorSwatchPicker aria-label="Color" :items="colors" default-value="#8B5CF6" />
</template>
