<script setup lang="ts">
import { ColorArea, ColorPicker, ColorSlider, ColorSwatch, Label } from '@hareui/vue'
</script>

<template>
  <ColorPicker default-value="#0485F7" :ui="{ trigger: 'rounded-xl bg-default-soft px-3 py-2', popover: 'bg-surface' }">
    <template #trigger>
      <ColorSwatch size="lg" />
      <Label class="font-medium text-foreground">Theme color</Label>
    </template>
    <ColorArea aria-label="Color area" class="max-w-full" color-space="hsb" x-channel="saturation" y-channel="brightness" />
    <ColorSlider channel="hue" class="gap-1 px-1" color-space="hsb" label="Hue" :ui="{ output: 'text-muted' }" />
  </ColorPicker>
</template>
