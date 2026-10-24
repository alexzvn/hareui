<script setup lang="ts">
import { CellColorPicker, ColorField, ColorSlider, ColorSwatchPicker } from '@hareui/vue'

const folderColors = [
  '#B45309',
  '#65A30D',
  '#0F766E',
  '#1D4ED8',
  '#7C3AED',
  '#BE185D',
  '#DC2626',
  '#57534E',
]
</script>

<template>
  <div class="w-72">
    <CellColorPicker default-value="#0F766E" label="Folder color">
      <ColorField full-width label="Hex" />
      <ColorSlider channel="lightness" color-space="hsl" label="Lightness" />
      <ColorSwatchPicker
        aria-label="Presets"
        class="grid grid-cols-8 gap-1"
        :items="folderColors"
        size="sm"
        variant="square"
      />
    </CellColorPicker>
  </div>
</template>
