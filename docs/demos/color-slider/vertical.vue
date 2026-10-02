<script setup lang="ts">
import { ColorSlider } from 'herouse'
</script>

<template>
  <div class="flex h-48 gap-4">
    <ColorSlider aria-label="Hue" channel="hue" default-value="hsl(0, 100%, 50%)" orientation="vertical" />
    <ColorSlider aria-label="Saturation" channel="saturation" default-value="hsl(0, 100%, 50%)" orientation="vertical" />
    <ColorSlider aria-label="Lightness" channel="lightness" default-value="hsl(0, 100%, 50%)" orientation="vertical" />
  </div>
</template>
