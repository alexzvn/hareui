<script setup lang="ts">
import { ColorArea, ColorPicker, ColorSlider, ColorSwatch, ColorSwatchPicker, Label } from 'herouse'

const presets = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e']
</script>

<template>
  <ColorPicker default-value="#F43F5E">
    <template #trigger>
      <ColorSwatch size="lg" />
      <Label>Brand Color</Label>
    </template>
    <ColorArea aria-label="Color area" class="max-w-full" color-space="hsb" x-channel="saturation" y-channel="brightness" />
    <ColorSlider aria-label="Hue slider" channel="hue" class="gap-1 px-1" color-space="hsb" label="Hue" :ui="{ output: 'text-muted' }" />
    <ColorSwatchPicker :items="presets" class="justify-center px-1" size="xs" />
  </ColorPicker>
</template>
