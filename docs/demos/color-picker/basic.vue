<script setup lang="ts">
import { ColorArea, ColorPicker, ColorSlider, ColorSwatch, Label } from '@hareui/vue'
</script>

<template>
  <ColorPicker default-value="#0485F7">
    <template #trigger>
      <ColorSwatch size="lg" />
      <Label>Pick a color</Label>
    </template>
    <ColorArea aria-label="Color area" class="max-w-full" color-space="hsb" x-channel="saturation" y-channel="brightness" />
    <ColorSlider channel="hue" class="gap-1 px-1" color-space="hsb" label="Hue" :ui="{ output: 'text-muted' }" />
  </ColorPicker>
</template>
